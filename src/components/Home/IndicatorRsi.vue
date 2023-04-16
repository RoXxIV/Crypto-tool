<template>
  <div class="mt-4">
    <p class="text-white">
      Indicateur RSI :
      <span :class="getRsiColor(rsi.toFixed(2))">{{ rsi.toFixed(2) }}</span>
      <sup
        class="text-xm text-white cursor-help ml-1 group cursor-pointer"
        @click="showInfoRsi = !showInfoRsi"
      >
        ?
      </sup>
    </p>

    <br />
    <p
      v-show="showInfoRsi"
      class="text-white text-xs leading-relaxed mb-4"
      @click="showInfoRsi = false"
    >
      Un RSI inférieur à 30 indique un actif sur-vendu, et un RSI supérieur à 70
      indique un actif sur-acheté.
    </p>
  </div>
</template>
<script>
export default {
  name: "indicator-rsi",
  props: {
    rsi: Number,
  },
  data() {
    return {
      showInfoRsi: false,
    };
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
