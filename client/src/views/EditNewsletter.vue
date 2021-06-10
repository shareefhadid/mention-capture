<template>
  <div>
    <Newsletter></Newsletter>
  </div>
</template>

<script>
import Newsletter from "../components/Newsletter.vue";
export default {
  name: "EditNewsletter",
  components: { Newsletter },
  beforeUnmount() {
    this.$store.commit("removeNewsletter");
  },
};
</script>

<style scoped></style>
