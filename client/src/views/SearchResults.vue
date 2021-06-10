<template>
  <div class="section">
    <div class="container">
      <h1 class="result-page-title">Search Results:</h1>
      <h2 class="result-subheading">{{ resultSubHeading }}</h2>
      <h2 class="search-title" v-if="results.length < 1">
        No new results were found since this search was last executed.
      </h2>
      <div v-for="(searchResults, searchId) in resultsBySearch" :key="searchId">
        <h2 class="search-title" v-if="numOfSearches > 1">
          {{ getSearchName(searchId) }}
        </h2>
        <div v-for="(result, index) in searchResults" :key="index">
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
  </div>
</template>

<script>
import ResultItem from "../components/ResultItem.vue";
export default {
  components: { ResultItem },
  props: { passedSearches: Array },
  name: "SearchResults",
  methods: {
    dateString(date) {
      const newDate = new Date(date);
      return newDate.toDateString();
    },
    getSearchName(id) {
      return this.$store.state.searches.find((search) => search._id === id)
        .search_name;
    },
  },
  computed: {
    results() {
      return this.$store.state.results;
    },
    resultsBySearch() {
      const resultsBySearch = {};
      this.results.forEach((result) => {
        if (resultsBySearch[result.search_id]) {
          resultsBySearch[result.search_id].push(result);
        } else {
          resultsBySearch[result.search_id] = [result];
        }
      });
      return resultsBySearch;
    },
    numOfSearches() {
      if (this.passedSearches) return this.passedSearches.length;
      return null;
    },
    resultSubHeading() {
      if (this.numOfSearches === 1) {
        return this.getSearchName(this.passedSearches[0]);
      } else {
        return "Multisearch";
      }
    },
  },
};
</script>

<style></style>
