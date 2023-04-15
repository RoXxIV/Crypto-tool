<template>
  <div id="results">
    <div>
      <button @click="explicationToggle = !explicationToggle">
        explications support et de résistance
      </button>
      <div v-if="explicationToggle">
        <p>
          "Les niveaux de support et de résistance sont déterminés en se basant
          sur des observations historiques de prix et d'autres méthodes, comme
          les retracements de Fibonacci. Ils représentent des zones clés où les
          acheteurs et les vendeurs sont susceptibles d'entrer en action,
          influençant ainsi le mouvement des prix."
        </p>
      </div>
      <br />
      <button @click="pivotExplicationToggle = !pivotExplicationToggle">
        explications niveaux de support et de résistance des points pivots
      </button>
      <div v-if="pivotExplicationToggle">
        <p>
          "Les niveaux de support et de résistance des points pivots sont
          calculés à partir de formules mathématiques qui prennent en compte les
          prix hauts, bas et de clôture d'une période de temps spécifique. Ils
          permettent d'identifier des zones de prix où les acheteurs et les
          vendeurs pourraient intervenir, offrant ainsi des opportunités de
          trading basées sur les points pivots."
        </p>
      </div>
    </div>

    <div id="without-pivots">
      <!-- Niveaux de support -->
      <div>
        <h3>Niveaux de support :</h3>
        <ul v-if="supports.length">
          <li v-for="(support, index) in supports" :key="index">
            S{{ index + 1 }}: {{ support.price.toFixed(2) }}
          </li>
        </ul>
        <p v-else>N/A</p>
      </div>
      <!-- Niveaux de résistance -->
      <div>
        <h3>Niveaux de résistance :</h3>
        <ul v-if="resistances.length">
          <li v-for="(resistance, index) in resistances" :key="index">
            R{{ index + 1 }}: {{ resistance.price.toFixed(2) }}
          </li>
        </ul>
        <p v-else>N/A</p>
      </div>
    </div>
    <div id="with-pivots">
      <!-- Niveaux de support des points pivots -->
      <div>
        <h3>Niveaux de support<br />des points pivots :</h3>
        <ul>
          <li>S1: {{ pivotPoints.s1.toFixed(2) }}</li>
          <li>S2: {{ pivotPoints.s2.toFixed(2) }}</li>
          <li>S3: {{ pivotPoints.s3.toFixed(2) }}</li>
        </ul>
      </div>
      <!-- Niveaux de résistance des points pivots -->
      <div>
        <h3>Niveaux de résistance<br />des points pivots :</h3>
        <ul>
          <li>R1: {{ pivotPoints.r1.toFixed(2) }}</li>
          <li>R2: {{ pivotPoints.r2.toFixed(2) }}</li>
          <li>R3: {{ pivotPoints.r3.toFixed(2) }}</li>
        </ul>
      </div>
    </div>
  </div>
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
    return {
      pivotExplicationToggle: false,
      explicationToggle: false,
    };
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
