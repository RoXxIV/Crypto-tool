<template>
  <section>
    <div>
      <!-- Niveaux de support -->
      <h2 class="text-white text-2xl py-3">
        Supports et résistances
        <sup
          class="text-xm text-white cursor-help ml-1 group cursor-pointer"
          @click="showInfo = !showInfo"
        >
          ?
        </sup>
      </h2>
      <p
        v-show="showInfo"
        class="text-white text-xs leading-relaxed mb-4"
        @click="showInfo = false"
      >
        "Les niveaux de support et de résistance sont déterminés en se basant
        sur des observations historiques de prix et d'autres méthodes, comme les
        retracements de Fibonacci. Ils représentent des zones clés où les
        acheteurs et les vendeurs sont susceptibles d'entrer en action,
        influençant ainsi le mouvement des prix."
      </p>
      <div>
        <h3 class="text-white text-lg pb-2">Niveaux de support :</h3>
        <ul v-if="supports.length" class="grid grid-cols-4 gap-4">
          <li
            v-for="(support, index) in supports"
            :key="index"
            class="p-5 bg-white"
          >
            S{{ index + 1 }}: {{ support.price.toFixed(2) }}
          </li>
        </ul>
        <ul v-else class="grid grid-cols-4 gap-4">
          <li class="p-5 bg-white">N/A</li>
        </ul>
      </div>
      <!-- Niveaux de résistance -->
      <div>
        <h3 class="text-white text-lg pb-2">Niveaux de résistance :</h3>
        <ul v-if="resistances.length" class="grid grid-cols-4 gap-4">
          <li
            v-for="(resistance, index) in resistances"
            :key="index"
            class="p-5 bg-white"
          >
            R{{ index + 1 }}: {{ resistance.price.toFixed(2) }}
          </li>
        </ul>
        <ul v-else class="grid grid-cols-4 gap-4">
          <li class="p-5 bg-white">N/A</li>
        </ul>
      </div>
    </div>
    <div>
      <!-- Niveaux de support des points pivots -->
      <div>
        <h2 class="text-white text-2xl py-3">
          Supports et résistances des points pivots
          <sup
            class="text-xm text-white cursor-help ml-1 group cursor-pointer"
            @click="showInfoPivots = !showInfoPivots"
          >
            ?
          </sup>
        </h2>
        <p
          v-show="showInfoPivots"
          class="text-white text-xs leading-relaxed mb-4"
          @click="showInfoPivots = false"
        >
          Les niveaux de support et de résistance des points pivots sont
          calculés à partir de formules mathématiques qui prennent en compte les
          prix hauts, bas et de clôture d'une période de temps spécifique. Ils
          permettent d'identifier des zones de prix où les acheteurs et les
          vendeurs pourraient intervenir, offrant ainsi des opportunités de
          trading basées sur les points pivots."
        </p>
        <h3 class="text-white text-lg pb-2">
          Niveaux de support des points pivots :
        </h3>
        <ul class="grid grid-cols-4 gap-4">
          <li class="p-5 bg-white">S1: {{ pivotPoints.s1.toFixed(2) }}</li>
          <li class="p-5 bg-white">S2: {{ pivotPoints.s2.toFixed(2) }}</li>
          <li class="p-5 bg-white">S3: {{ pivotPoints.s3.toFixed(2) }}</li>
        </ul>
      </div>
      <!-- Niveaux de résistance des points pivots -->
      <div>
        <h3 class="text-white text-lg pb-2">
          Niveaux de résistance des points pivots :
        </h3>
        <ul class="grid grid-cols-4 gap-4">
          <li class="p-5 bg-white">R1: {{ pivotPoints.r1.toFixed(2) }}</li>
          <li class="p-5 bg-white">R2: {{ pivotPoints.r2.toFixed(2) }}</li>
          <li class="p-5 bg-white">R3: {{ pivotPoints.r3.toFixed(2) }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "results",
  props: {
    supports: Array,
    resistances: Array,
    pivotPoints: Object,
  },
  data() {
    return { showInfo: false, showInfoPivots: false };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@media (min-width: 768px) and (max-width: 1024px) {
}
@media (max-width: 767px) {
}
</style>
