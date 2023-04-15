<template>
  <div class="relative inline-flex items-center my-3">
    <p class="text-white">
      Indicateur RSI :
      <span :class="getRsiColor(rsi.toFixed(2))">{{ rsi.toFixed(2) }}</span>
    </p>
    <sup class="text-xs text-white cursor-help ml-1 group">
      <span
        class="absolute invisible group-hover:visible bg-white p-2 rounded shadow-md text-xs -mt-6 -mr-6 text-black whitespace-nowrap"
      >
        Un RSI inférieur à 30 indique un actif sur-vendu, et un RSI supérieur à
        70 indique un actif sur-acheté.
      </span>
      ?
    </sup>
  </div>
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
