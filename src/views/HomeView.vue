<template>
  <section>
    <!-- Formulaire -->
    <div id="Form-crypto-settings">
      <!-- Choix crypto -->
      <div id="crypto-choice">
        <label for="crypto">Crypto-monnaie :</label>
        <select v-model="selectedCrypto" id="crypto">
          <option v-for="crypto in cryptos" :key="crypto" :value="crypto">
            {{ crypto }}
          </option>
        </select>
      </div>
      <!-- Choix Devise -->
      <div id="quote-choice">
        <label for="quote">Devise :</label>
        <select v-model="selectedQuote" id="quote">
          <option v-for="quote in quotes" :key="quote" :value="quote">
            {{ quote }}
          </option>
        </select>
      </div>
      <!-- Choix Intervalle de temps -->
      <div id="interval-choice">
        <label for="interval">Intervalle :</label>
        <select v-model="selectedInterval" id="interval">
          <option
            v-for="interval in intervals"
            :key="interval"
            :value="interval"
          >
            {{ interval }}
          </option>
        </select>
      </div>
    </div>
    <!-- Mettre à jour les données -->
    <div>
      <button @click="fetchData">Mettre à jour</button>
    </div>
    <!-- paramètres choisis et prix actuel -->
    <h2>{{ selectedCrypto }}/{{ selectedQuote }} "{{ selectedInterval }}"</h2>
    <p>Prix actuel : {{ currentPrice }}</p>
    <p>
      Variation sur 24h : {{ priceChange.toFixed(2) }} ({{
        priceChangePercent.toFixed(2)
      }}%)
    </p>
    <p>24h Haut : {{ highPrice.toFixed(2) }}</p>
    <p>24h Bas : {{ lowPrice.toFixed(2) }}</p>

    <div id="results">
      <div id="without-pivots">
        <!-- Niveaux de support -->
        <div>
          <h3>Niveaux de support :</h3>
          <ul>
            <li v-for="(support, index) in supports" :key="index">
              Support {{ index + 1 }}: {{ support.price.toFixed(2) }}
            </li>
          </ul>
        </div>
        <!-- Niveaux de résistance -->
        <div>
          <h3>Niveaux de résistance :</h3>
          <ul>
            <li v-for="(resistance, index) in resistances" :key="index">
              Résistance {{ index + 1 }}: {{ resistance.price.toFixed(2) }}
            </li>
          </ul>
        </div>
      </div>
      <div id="with-pivots">
        <!-- Niveaux de support des points pivots -->
        <div>
          <h3>Niveaux de support des points pivots :</h3>
          <ul>
            <li>Support 1: {{ pivotPoints.s1.toFixed(2) }}</li>
            <li>Support 2: {{ pivotPoints.s2.toFixed(2) }}</li>
            <li>Support 3: {{ pivotPoints.s3.toFixed(2) }}</li>
          </ul>
        </div>
        <!-- Niveaux de résistance des points pivots -->
        <div>
          <h3>Niveaux de résistance des points pivots :</h3>
          <ul>
            <li>Résistance 1: {{ pivotPoints.r1.toFixed(2) }}</li>
            <li>Résistance 2: {{ pivotPoints.r2.toFixed(2) }}</li>
            <li>Résistance 3: {{ pivotPoints.r3.toFixed(2) }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import cryptoServices from "../services/cryptoServices";
export default {
  name: "Home",
  data() {
    return {
      data: [],
      currentPrice: 0,
      supports: [],
      resistances: [],
      cryptos: [
        "BTC",
        "ETH",
        "SOL",
        "MINA",
        "BNB",
        "SHIB",
        "ADA",
        "PROM",
        "BURGER",
        "ATOM",
      ],
      quotes: ["USDT", "EUR"],
      intervals: ["1h", "4h", "1d", "1w"],
      selectedCrypto: "BTC",
      selectedQuote: "USDT",
      selectedInterval: "4h",
      pivotPoints: {
        r1: 0,
        r2: 0,
        r3: 0,
        s1: 0,
        s2: 0,
        s3: 0,
      },
      priceChange: 0,
      priceChangePercent: 0,
      highPrice: 0,
      lowPrice: 0,
    };
  },
  methods: {
    /**
     * Récupère le prix actuel d'un symbole de crypto-monnaie et le stocke dans 'currentPrice'.
     *
     * @param {string} symbol - Le symbole de la crypto-monnaie (ex: "BTCUSDT").
     */
    async fetchCurrentPrice(symbol) {
      try {
        // Appeler le service pour obtenir le prix actuel du symbole de crypto-monnaie
        const response = await cryptoServices.getCurrentPrice(symbol);
        // Convertir la réponse en nombre décimal et l'attribuer à currentPrice
        this.currentPrice = parseFloat(response.data.price);
        console.log("Current price:", this.currentPrice);
      } catch (error) {
        console.error("Error fetching current price from Binance API:", error);
      }
    },
    /**
     * Trouve les niveaux de support et de résistance en utilisant les retracements de Fibonacci.
     *
     * @param {Array} data - Les données de prix pour un symbole de crypto-monnaie.
     * @returns {Object} - Un objet contenant les tableaux des niveaux de support et de résistance.
     */
    findSupportAndResistance(data) {
      // Extraire les prix bas et haut de chaque kline (bougies)
      const lowPrices = data.map((kline) => parseFloat(kline[3]));
      const highPrices = data.map((kline) => parseFloat(kline[2]));

      // Trouver le prix minimum et maximum dans les données
      const minPrice = Math.min(...lowPrices);
      const maxPrice = Math.max(...highPrices);

      // Définir les niveaux de retracement de Fibonacci
      const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
      // Calculer les niveaux de prix de Fibonacci
      const fibonacciLevels = levels.map((level) => ({
        level,
        price: minPrice + (maxPrice - minPrice) * level,
      }));

      // Filtrer les niveaux de Fibonacci pour déterminer les supports et les résistances
      const supports = fibonacciLevels.filter(
        (level) => level.price < this.currentPrice
      );
      const resistances = fibonacciLevels.filter(
        (level) => level.price > this.currentPrice
      );

      return {
        supports,
        resistances,
      };
    },
    /**
     * Calcule les points pivots (PP, R1, R2, R3, S1, S2, S3) pour un symbole de crypto-monnaie.
     *
     * @param {Array} data - Les données de prix pour un symbole de crypto-monnaie.
     * @returns {Object} - Un objet contenant les points pivots.
     */
    calculatePivotPoints(data) {
      // Récupérer la dernière kline complète (bougie)
      const previousKline = data[data.length - 2];
      // Extraire les valeurs de prix haut, bas et de clôture de la kline précédente
      const high = parseFloat(previousKline[2]);
      const low = parseFloat(previousKline[3]);
      const close = parseFloat(previousKline[4]);

      // Calculer le point pivot
      const pivotPoint = (high + low + close) / 3;

      // Calculer les niveaux de résistance (R1, R2, R3)
      const r1 = 2 * pivotPoint - low;
      const r2 = pivotPoint + (high - low);
      const r3 = high + 2 * (pivotPoint - low);

      // Calculer les niveaux de support (S1, S2, S3)
      const s1 = 2 * pivotPoint - high;
      const s2 = pivotPoint - (high - low);
      const s3 = low - 2 * (high - pivotPoint);

      // Retourner les points pivots avec les niveaux de résistance et de support
      return {
        r1,
        r2,
        r3,
        s1,
        s2,
        s3,
      };
    },
    /**
     * Récupère les statistiques sur 24 heures pour un symbole de crypto-monnaie et les stocke dans les variables correspondantes.
     *
     * @param {string} symbol - Le symbole de la crypto-monnaie (ex: "BTCUSDT").
     */
    async fetch24hStats(symbol) {
      try {
        // Effectuer une requête pour obtenir les statistiques sur 24 heures
        const response = await cryptoServices.get24hStats(symbol);
        // Extraire et convertir les données de la réponse
        this.priceChange = parseFloat(response.data.priceChange);
        this.priceChangePercent = parseFloat(response.data.priceChangePercent);
        this.high24h = parseFloat(response.data.highPrice);
        this.low24h = parseFloat(response.data.lowPrice);
        console.log("24h stats:", response.data);
      } catch (error) {
        console.error("Error fetching 24h stats from Binance API:", error);
      }
    },
    /**
     * Récupère les données de prix, les supports, les résistances, les points pivots et les statistiques sur 24 heures pour un symbole de crypto-monnaie.
     */
    async fetchData() {
      try {
        // Créer le symbole à partir des cryptos et devises sélectionnées
        const symbol = this.selectedCrypto + this.selectedQuote;
        // Définir l'intervalle de temps à utiliser
        const interval = this.selectedInterval;
        // Récupérer les données de prix pour le symbole et l'intervalle sélectionnés
        const response = await cryptoServices.getCryptoPrice(symbol, interval);
        this.data = response.data;
        // Trouver les niveaux de support et de résistance à partir des données
        const { supports, resistances } = this.findSupportAndResistance(
          this.data
        );
        this.supports = supports;
        this.resistances = resistances;
        // Calculer les points pivots à partir des données
        this.pivotPoints = this.calculatePivotPoints(this.data);
        // Récupérer le prix actuel pour le symbole sélectionné
        await this.fetchCurrentPrice(symbol);

        // Récupérer les statistiques sur 24 heures pour le symbole sélectionné
        const statsResponse = await cryptoServices.fetch24hStats(symbol);
        this.priceChange = parseFloat(statsResponse.data.priceChange);
        this.priceChangePercent = parseFloat(
          statsResponse.data.priceChangePercent
        );
        this.highPrice = parseFloat(statsResponse.data.highPrice);
        this.lowPrice = parseFloat(statsResponse.data.lowPrice);
      } catch (error) {
        console.error("Error fetching data from Binance API:", error);
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
<style scoped>
ul {
  list-style: none;
}
</style>
