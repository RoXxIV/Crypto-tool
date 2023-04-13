<template>
  <p>
    <strong>Indicateur RSI :</strong> Le RSI actuel est de
    <span :class="getRsiColor(rsi.toFixed(2))">{{ rsi.toFixed(2) }}</span
    >. Un RSI inférieur à 30 indique un actif sur-vendu, et un RSI supérieur à
    70 indique un actif sur-acheté.
  </p>
</template>
<script>
export default {
  name: "indicator-rsi",
  props: {
    rsi: Number,
  },
  data() {
    return {};
  },
  methods: {
    getRsiColor(rsi) {
      if (rsi > 70 || rsi < 30) {
        return "rsi-text-red";
      } else {
        return "rsi-text-green";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rsi-text-red {
  color: red;
}
.rsi-text-green {
  color: green;
}
</style>
