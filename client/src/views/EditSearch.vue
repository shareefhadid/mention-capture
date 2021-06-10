<template>
  <div>
    <Search></Search>
  </div>
</template>

<script>
import Search from "../components/Search.vue";
export default {
  name: "EditSearch",
  components: { Search },
  beforeUnmount() {
    this.$store.commit("removeSearch");
  },
};
</script>

<style scoped></style>
