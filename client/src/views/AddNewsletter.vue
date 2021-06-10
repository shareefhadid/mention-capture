<template>
  <div>
    <Newsletter :passedSearches="passedSearches"></Newsletter>
  </div>
</template>

<script>
import Newsletter from "../components/Newsletter.vue";
export default {
  name: "AddNewsletter",
  props: { passedSearches: Array },
  components: { Newsletter },
};
</script>

<style scoped></style>
