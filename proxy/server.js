// Importation des dépendances
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Création de l'application Express et activation de CORS
const app = express();
app.use(cors());

// URL de base de l'API Binance
const BINANCE_API = "https://api.binance.com";

/**
 * Route pour récupérer les données de chandelier (klines) de l'API Binance.
 * Retourne les données sous format JSON.
 *
 * @param {Object} req - Requête HTTP entrante.
 * @param {Object} res - Réponse HTTP sortante.
 * @returns {Object} - Les données de chandelier (klines).
 */
app.get("/api/v3/klines", async (req, res) => {
  try {
    const response = await axios.get(`${BINANCE_API}/api/v3/klines`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching klines data from Binance API",
      error: error.response ? error.response.data : "Unknown error",
    });
  }
});

/**
 * Route pour récupérer les données de prix actuel de l'API Binance.
 * Retourne les données sous format JSON.
 *
 * @param {Object} req - Requête HTTP entrante.
 * @param {Object} res - Réponse HTTP sortante.
 * @returns {Object} - Les données de prix actuel.
 */
app.get("/api/v3/ticker/price", async (req, res) => {
  try {
    const response = await axios.get(`${BINANCE_API}/api/v3/ticker/price`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching ticker price data from Binance API",
      error: error.response ? error.response.data : "Unknown error",
    });
  }
});

/**
 * Route pour récupérer les données statistiques sur 24 heures de l'API Binance.
 * Retourne les données sous format JSON.
 *
 * @param {Object} req - Requête HTTP entrante.
 * @param {Object} res - Réponse HTTP sortante.
 * @returns {Object} - Les données statistiques sur 24 heures.
 */
app.get("/api/v3/ticker/24hr", async (req, res) => {
  try {
    const response = await axios.get(`${BINANCE_API}/api/v3/ticker/24hr`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching 24h stats data from Binance API",
      error: error.response ? error.response.data : "Unknown error",
    });
  }
});

// Démarrage du serveur sur le port spécifié
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
