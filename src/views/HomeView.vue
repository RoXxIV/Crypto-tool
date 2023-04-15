<template>
  <div class="w-3/4 mx-auto">
    <!-- Formulaire -->
    <div
      class="flex flex-col items-center sm:grid sm:grid-cols-3 sm:gap-4 w-full my-3"
    >
      <!-- Choix crypto -->
      <div class="w-full sm:mb-0 mb-4">
        <label for="crypto" class="block mb-2 text-md font-medium text-white"
          >Crypto-monnaie :</label
        >
        <div v-if="loading" class="skeleton w-full h-8 rounded-lg"></div>
        <select
          v-else
          v-model="selectedCrypto"
          @change="fetchData"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg block p-1.5"
        >
          <option v-for="crypto in cryptos" :key="crypto" :value="crypto">
            {{ crypto }}
          </option>
        </select>
      </div>
      <!-- Choix Devise -->
      <div class="w-full sm:mb-0 mb-4">
        <label for="quote" class="block mb-2 text-md font-medium text-white"
          >Devise :</label
        >
        <div v-if="loading" class="skeleton w-full h-8 rounded-lg"></div>
        <select
          v-else
          v-model="selectedQuote"
          @change="fetchData"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg block p-1.5"
        >
          <option v-for="quote in quotes" :key="quote" :value="quote">
            {{ quote }}
          </option>
        </select>
      </div>
      <!-- Choix Intervalle de temps -->
      <div class="w-full">
        <label for="interval" class="block mb-2 text-md font-medium text-white"
          >Intervalle :</label
        >
        <div v-if="loading" class="skeleton w-full h-8 rounded-lg"></div>
        <select
          v-else
          v-model="selectedInterval"
          @change="fetchData"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg block p-1.5"
        >
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
    <div v-if="loading" class="skeleton w-full h-8 rounded-lg my-2"></div>
    <!-- Affiche le RSI actuel -->
    <IndicatorRsi v-else :rsi="rsi" />
    <!-- paramètres choisis et prix actuel et variations -->
    <div v-if="loading" class="skeleton w-full h-32 rounded-lg my-2"></div>
    <PriceAndVariations
      v-else
      :selected-crypto="selectedCrypto"
      :selected-quote="selectedQuote"
      :selected-interval="selectedInterval"
      :current-price="currentPrice"
      :price-change="priceChange"
      :price-change-percent="priceChangePercent"
      :high-price="highPrice"
      :low-price="lowPrice"
    />
    <div v-if="loading" class="skeleton w-full h-64 rounded-lg my-2"></div>
    <!-- Affiche les support et resistance ainsi que leur points pivots -->
    <SupportAndResistance
      v-else
      :supports="supports"
      :resistances="resistances"
      :pivot-points="pivotPoints"
    />
    <!-- en cours de développement -->
    <p v-if="loading" class="skeleton w-1/2 h-6 rounded-lg my-2"></p>
    <p v-else class="py-3">
      Recommandation : {{ shouldInvest() }} (beta, ne pas prendre en compte)
    </p>
  </div>
</template>

<script>
import cryptoServices from "../services/cryptoServices";
import PriceAndVariations from "../components/Home/PriceAndVariations.vue";
import SupportAndResistance from "../components/Home/SupportAndResistance.vue";
import IndicatorRsi from "../components/Home/IndicatorRsi.vue";
export default {
  name: "Home",
  components: { PriceAndVariations, SupportAndResistance, IndicatorRsi },
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
      rsi: null,
      loading: false,
    };
  },
  methods: {
    /**
     * Récupère le prix actuel d'une crypto-monnaie et le stocke dans 'currentPrice'.
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
     * Récupère les statistiques sur 24 heures pour une crypto-monnaie et les stocke dans les variables correspondantes.
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
     * Calcule l'indice de force relative (RSI) pour un ensemble de données de prix sur 14 jours.
     * @param {Array} data - Tableau de données de prix, où chaque élément est un tableau avec les prix d'ouverture, de clôture, les plus hauts et les plus bas.
     * @param {number} period - La période sur laquelle calculer le RSI (par défaut : 14).
     * @returns {number} - La valeur RSI calculée.
     */
    calculateRSI(data, period = 14) {
      const gains = [];
      const losses = [];

      for (let i = 1; i < data.length; i++) {
        const previousClose = parseFloat(data[i - 1][4]);
        const currentClose = parseFloat(data[i][4]);

        const change = currentClose - previousClose;

        if (change >= 0) {
          gains.push(change);
          losses.push(0);
        } else {
          gains.push(0);
          losses.push(Math.abs(change));
        }
      }

      const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

      let rs = avgGain / avgLoss;
      let rsi = 100 - 100 / (1 + rs);

      for (let i = period; i < gains.length; i++) {
        const gain = gains[i];
        const loss = losses[i];

        const newAvgGain = (avgGain * (period - 1) + gain) / period;
        const newAvgLoss = (avgLoss * (period - 1) + loss) / period;

        rs = newAvgGain / newAvgLoss;
        rsi = 100 - 100 / (1 + rs);
      }

      return rsi;
    },
    /**
     * Analyse les indicateurs et niveaux clés pour déterminer s'il faut investir, ne pas investir ou attendre.
     * Cette méthode se base sur les critères suivants :
     * - Investir : RSI en survente (< 30), prix proche d'un niveau de support et prix au-dessus du point pivot S1.
     * - Ne pas investir : RSI en surachat (> 70), prix proche d'un niveau de résistance et prix en dessous du point pivot R1.
     * - Attendre : Dans tous les autres cas.
     * en cours de développement !!!
     *
     * @returns {string} La recommandation d'action à prendre : "Investir", "Ne pas investir" ou "Attendre".
     */
    shouldInvest() {
      // Conditions pour investir
      const isRSIOverSold = this.rsi < 30;
      const isPriceNearSupport = this.supports.some(
        (support) =>
          Math.abs(this.currentPrice - support.price) < this.currentPrice * 0.01
      );
      const isPriceAbovePivot = this.currentPrice > this.pivotPoints.s1;

      // Conditions pour ne pas investir
      const isRSIOverBought = this.rsi > 70;
      const isPriceNearResistance = this.resistances.some(
        (resistance) =>
          Math.abs(this.currentPrice - resistance.price) <
          this.currentPrice * 0.01
      );
      const isPriceBelowPivot = this.currentPrice < this.pivotPoints.r1;

      if (isRSIOverSold && isPriceNearSupport && isPriceAbovePivot) {
        return "Investir";
      } else if (
        isRSIOverBought &&
        isPriceNearResistance &&
        isPriceBelowPivot
      ) {
        return "Ne pas investir";
      } else {
        return "Attendre";
      }
    },
    /**
     * Récupère les données de prix, les niveaux de support et de résistance, les points pivots, le prix actuel et les statistiques sur 24 heures pour un symbole de crypto-monnaie.
     * La méthode effectue les opérations suivantes :
     * 1. Crée le symbole à partir des cryptos et devises sélectionnées.
     * 2. Définit l'intervalle de temps à utiliser.
     * 3. Récupère les données de prix pour le symbole et l'intervalle sélectionnés.
     * 4. Trouve les niveaux de support et de résistance à partir des données.
     * 5. Calcule les points pivots à partir des données.
     * 6. Récupère le prix actuel pour le symbole sélectionné.
     * 7. Récupère les statistiques sur 24 heures pour le symbole sélectionné, y compris le changement de prix, le pourcentage de changement de prix, le prix le plus élevé et le prix le plus bas.
     * 8. Calcule la valeur RSI en utilisant les données du prix et met à jour la propriété "rsi" du composant.
     *
     * @throws {Error} Si une erreur se produit lors de la récupération des données de l'API Binance.
     */

    async fetchData() {
      this.loading = true;
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

        // Calcule la valeur RSI en utilisant les données du prix et met à jour la propriété "rsi" du composant
        this.rsi = this.calculateRSI(this.data);
        this.loading = false;
        console.log("Data from Binance API:", response.data);
      } catch (error) {
        this.loading = false;
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
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
@media (min-width: 768px) and (max-width: 1024px) {
}
@media (max-width: 767px) {
}
</style>
