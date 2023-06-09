import axios from "axios";

// Configuration globale d'axios avec des en-têtes par défaut
axios.create({
  headers: {
    "Content-type": "application/json",
  },
});

// URL de base de l'API de proxy
const PROXY_API = "http://localhost:3001";

class CryptoService {
  /**
   * Récupère le prix actuel d'une crypto-monnaie.
   *
   * @param {string} symbol - Le symbole de la crypto-monnaie (ex: "BTCUSDT").
   * @returns {Promise} - La réponse de l'API sous forme de promesse.
   */
  getCurrentPrice(symbol) {
    return axios.get(`${PROXY_API}/api/v3/ticker/price`, {
      params: {
        symbol,
      },
    });
  }

  /**
   * Récupère les données de prix d'un symbole de crypto-monnaie pour un intervalle et une limite spécifiés.
   *
   * @param {string} symbol - Le symbole de la crypto-monnaie (ex: "BTCUSDT").
   * @param {string} interval - L'intervalle pour les données de prix (ex: "4h").
   * @param {number} limit - La limite du nombre de données de prix à récupérer.
   * @returns {Promise} - La réponse de l'API sous forme de promesse.
   */
  getCryptoPrice(symbol, interval = "4h", limit = 500) {
    return axios.get(`${PROXY_API}/api/v3/klines`, {
      params: {
        symbol,
        interval,
        limit,
      },
    });
  }

  /**
   * Récupère les données statistiques sur 24 heures d'un symbole de crypto-monnaie.
   *
   * @param {string} symbol - Le symbole de la crypto-monnaie (ex: "BTCUSDT").
   * @returns {Promise} - La réponse de l'API sous forme de promesse.
   */
  fetch24hStats(symbol) {
    return axios.get(`${PROXY_API}/api/v3/ticker/24hr`, {
      params: {
        symbol,
      },
    });
  }
}
// Exporte une instance unique de la classe CryptoService
export default new CryptoService();
