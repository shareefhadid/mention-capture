<template>
  <div>
    <div class="item-top-container" @click="editSearch()">
      <a
        class="times-icon"
        href="delete-search"
        @click.stop.prevent="deleteSearch()"
      >
        <font-awesome-icon icon="times" size="xs" />
      </a>
      <h2>
        <font-awesome-icon
          icon="exclamation-triangle"
          size="xs"
          class="exclamation-icon"
          v-if="hasBadUrls"
        />{{ search.search_name }}
      </h2>

      <h3>Terms ({{ search.search_terms.length }})</h3>
      <div class="limit-terms">
        {{ mergedTerms }}
        <span v-if="mergedTerms.length === 0">&nbsp;</span>
      </div>
      <h3>Sources ({{ search.sources.length }})</h3>
      <div class="limit-terms">
        {{ mergedSources }}
      </div>
    </div>
    <div class="item-bottom-container">
      <Checkbox v-model="checked" :binary="true" @click="sendSelected">
      </Checkbox>
      <a href="/search-history" @click.prevent="searchHistory()">
        <div class="item-button">
          <i class="pi pi-replay"></i>
          <p>History</p>
        </div>
      </a>
      <a href="/search-results"  @click.prevent="singleSearch()">
        <div class="item-button">
          <i class="pi pi-search-plus"></i>
          <p>Search</p>
        </div>
      </a>

    </div>
  </div>
</template>

<script>
export default {
  name: "SearchItem",
  props: {
    search: Object,
  },
  data() {
    return {
      checked: false,
    };
  },
  computed: {
    mergedTerms() {
      return this.search.search_terms.join(", ");
    },
    mergedSources() {
      return this.search.sources
        .map(({ source_name }) => source_name)
        .join(", ");
    },
    hasBadUrls() {
      return this.search.bad_urls.length > 0;
    },
  },
  methods: {
    editSearch() {
      this.$store.commit("setSearch", { search: this.search });
      return this.$router.push({ name: "editSearch" });
    },
    deleteSearch() {
      this.$confirm.require({
        message:
          "Are you sure you would like to delete this search? It will also be removed from newsletters.",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          return this.$store
            .dispatch("deleteSearch", {
              search_ids: [this.search._id],
            })
            .then(() =>
              this.$toast.add({
                severity: "success",
                summary: "Search Deleted",
                detail: "",
                life: 3000,
              })
            )
            .catch((error) => this.$emit("send-error", error));
        },
        reject: () => {},
      });
    },
    sendSelected() {
      return this.$emit("select-search", this.search._id);
    },
    singleSearch() {
      return this.$emit("single-search", [this.search._id]);
    },
    searchHistory() {
      return this.$emit("send-search-id", this.search._id);
    },
  },
};
</script>

<style scoped>
h2 {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
  margin-top: 4px;
  margin-left: 10px;
}
h3 {
  text-transform: uppercase;
  margin-top: 8px;
  margin-left: 10px;
}
.limit-terms {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: hsla(210, 30%, 20%, 0.7);
  margin-left: 10px;
}
.times-icon {
  display: inline-block;
  padding: 4px 10px;
  color: #aaa;
  transition: all 0.3s ease;
}
.times-icon:hover {
  color: hsla(210, 30%, 20%, 0.7);
}
.exclamation-icon {
  color: rgb(255, 58, 58);
  margin-right: 4px;
}
.item-bottom-container label {
  cursor: pointer;
  margin-left: 10px;
}

.p-checkbox {
  margin: 0px 8px
}

.p-button {
  padding: 6px 10px;
  margin: 4px 8px 4px 4px;
  background: transparent;
  color: #888;
  border-color: #ced4da;
}
</style>
