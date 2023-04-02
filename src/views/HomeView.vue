<template>
  <section>
    <!-- Formulaire -->
    <div id="Form-crypto-settings">
      <!-- Choix crypto -->
      <div id="crypto-choice" class="field">
        <label for="crypto">Crypto-monnaie :</label>
        <select v-model="selectedCrypto" id="crypto">
          <option v-for="crypto in cryptos" :key="crypto" :value="crypto">
            {{ crypto }}
          </option>
        </select>
      </div>
      <!-- Choix Devise -->
      <div id="quote-choice" class="field">
        <label for="quote">Devise :</label>
        <select v-model="selectedQuote" id="quote">
          <option v-for="quote in quotes" :key="quote" :value="quote">
            {{ quote }}
          </option>
        </select>
      </div>
      <!-- Choix Intervalle de temps -->
      <div id="interval-choice" class="field">
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
      <button @click="fetchData" class="btn">Mettre à jour</button>
    </div>

    <!-- paramètres choisis et prix actuel -->
    <CryptoDetails
      :selected-crypto="selectedCrypto"
      :selected-quote="selectedQuote"
      :selected-interval="selectedInterval"
      :current-price="currentPrice"
      :price-change="priceChange"
      :price-change-percent="priceChangePercent"
      :high-price="highPrice"
      :low-price="lowPrice"
    />
    <Results
      :supports="supports"
      :resistances="resistances"
      :pivot-points="pivotPoints"
    />
  </section>
</template>

<script>
import cryptoServices from "../services/cryptoServices";
import CryptoDetails from "../components/Home/CryptoDetails.vue";
import Results from "../components/Home/Results.vue";
export default {
  name: "Home",
  components: { CryptoDetails, Results },
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
<style lang="scss" scoped>
section {
  width: 50vw;
  margin: auto;
  font-family: "Roboto", sans-serif;
  color: #2c3138;
  h2,
  h3 {
    font-family: "Oswald", sans-serif;
  }
  #Form-crypto-settings {
    display: flex;
    justify-content: space-around;
    width: 50%;
    margin: 30px auto;
    .field {
      display: flex;
      flex-direction: column;
      align-items: center;
      label {
        font-family: "Oswald", sans-serif;
        font-size: 1.2em;
        margin-bottom: 10px;
      }
      select {
        width: 100%;
        background: #fafafa;
        border: none;
        border-bottom: 1px solid #2c3138;
        transition: border-color 0.3s;
        font-size: 1.1em;
        &:focus {
          border-color: #3b82f6;
        }
        &::placeholder {
          color: #3b82f6;
        }
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }
  }
  .btn {
    margin: auto;
    display: block;
    padding: 7px 14px;
    border: 1px solid #2c3138;
    border-radius: 0.25rem;
    background-color: white;
    font-family: "Roboto", sans-serif;
    font-weight: bold;
    letter-spacing: 1px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s ease 0s;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  #Form-crypto-settings {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
@media (max-width: 767px) {
  section {
    width: 100%;
    #Form-crypto-settings {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
  }
}
</style>
