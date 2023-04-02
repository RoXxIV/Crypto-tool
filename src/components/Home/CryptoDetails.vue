<template>
  <div id="selected-crypto-details">
    <h2>
      {{ selectedCrypto }}/{{ selectedQuote }}
      <sup>{{ selectedInterval }}</sup>
    </h2>
    <p>Prix actuel : {{ currentPrice }}</p>
    <p>
      Variation sur 24h :
      <span :class="getColor(priceChange)"
        >{{ priceChange.toFixed(2) }} ({{
          priceChangePercent.toFixed(2)
        }}%)</span
      >
    </p>
    <p>
      24h Haut : <span class="text-green">{{ highPrice.toFixed(2) }}</span>
    </p>
    <p>
      24h Bas : <span class="text-red">{{ lowPrice.toFixed(2) }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "crypto-details",
  props: {
    selectedCrypto: String,
    selectedQuote: String,
    selectedInterval: String,
    currentPrice: Number,
    priceChange: Number,
    priceChangePercent: Number,
    highPrice: Number,
    lowPrice: Number,
  },
  data() {
    return {};
  },
  methods: {
    getColor(price) {
      if (price > 0) {
        return "text-green";
      } else if (price === 0) {
        return "text-gray";
      } else {
        return "text-red";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#selected-crypto-details {
  text-align: center;
  margin-top: 30px;
  p {
    font-size: 1.1em;
  }
}
.text-green {
  color: green;
}
.text-gray {
  color: #2c3138;
}
.text-red {
  color: red;
}
@media (min-width: 768px) and (max-width: 1024px) {
}
@media (max-width: 767px) {
  #selected-crypto-details {
    font-size: 0.8em;
  }
}
</style>
