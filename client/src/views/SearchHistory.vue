<template>
  <div class="section">
    <div class="container">
      <h1 class="result-page-title">Search History:</h1>
      <h2 class="result-subheading">{{ searchName }}</h2>
      <h2 class="search-title" v-if="results.length < 1" >This search does not yet have a history.</h2>
      <div v-for="(result, index) in results" :key="index">
          <ResultItem
            :source="result.result_source"
            :title="result.result_title"
            :pubDate="dateString(result.result_date)"
            :excerpt="result.result_excerpt"
            :url="result.result_url"
          />
      </div>
    </div>
  </div>
</template>

<script>
import ResultItem from "../components/ResultItem.vue";
export default {
  components: { ResultItem },
  name: "SearchHistory",
  props: {searchId: String},
  methods: {
    dateString(date) {
      const newDate = new Date(date);
      return newDate.toDateString();
    },
  },
  computed: {
    results() {
      return this.$store.state.results;
    },
    searchName() {
      return this.$store.state.searches.find(
        (search) => search._id === this.searchId
      ).search_name;
    },
  },
};
</script>

<style></style>
