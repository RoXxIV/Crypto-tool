<template>
  <Header />
  <main>
    <RouterView />
  </main>
</template>
<script>
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/MyHeader.vue";
export default {
  components: {
    Header,
  },
};
</script>
<style></style>
