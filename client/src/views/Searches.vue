<template>
  <div id="page">
    <div class="section title-section">
      <div class="container">
        <h1 id="page-title">Searches</h1>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <!-- GRID FILTER -->
        <div class="p-grid grid-filter">
          <div class="p-col-12">
            <div class="p-inputgroup">
              <InputText
                placeholder="Filter searches"
                v-model="filter"
                class="filter"
              />
              <span class="p-inputgroup-addon">
                <Dropdown
                  v-model="filterBy"
                  :options="filterOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Search by"
                />
              </span>
            </div>
          </div>
        </div>

        <Message
          v-for="(msg, index) of messages"
          :severity="msg.severity"
          :key="index"
          >{{ msg.content }}</Message
        >
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="grid">
          <AddNewGridItem
            item="Search"
            @click="$router.push({ name: 'addSearch' })"
          />
          <div
            v-for="search in filteredSearches"
            :key="search._id"
            class="grid-item"
          >
            <SearchItem
              :search="search"
              @select-search="selectSearch"
              @send-search-id="viewHistory"
              @send-error="receiveError"
              @single-search="scrape"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="footer-section">
      <div id="footer-container">
        <p>{{ selected.length }} Selected:</p>
        <Button
          class="p-button-md p-button-primary"
          label="Create Newsletter"
          @click="createNewsletter"
          :disabled="isDisabled"
        />
        <Button
          class="p-button-md p-button-primary"
          label="Search"
          @click="scrape(selected)"
          :disabled="isDisabled"
        />
        <Button
          class="p-button-md p-button-primary"
          label="Delete"
          @click="deleteSearches"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SearchItem from "../components/SearchItem.vue";
import AddNewGridItem from "../components/AddNewGridItem.vue";

export default {
  components: { SearchItem, AddNewGridItem },
  name: "Searches",
  data() {
    return {
      filter: "",
      filterBy: "search_name",
      messages: [],
      selected: [],
      filterOptions: [
        { label: "by search name", value: "search_name" },
        { label: "by search term", value: "search_terms" },
        { label: "by source", value: "sources" },
      ],
    };
  },
  created() {
    this.$store
      .dispatch("getSearches")
      .then(() => {
        if (this.searches.some((search) => search.bad_urls.length > 0)) {
          return this.messages.push({
            severity: "error",
            content:
              "One or more searches contains errors, please edit the flagged searches. Note that some errors may not disappear until the search is rerun.",
          });
        }
      })
      .catch((error) =>
        this.messages.push({ severity: "error", content: error })
      );
  },
  computed: {
    searches() {
      return this.$store.state.searches;
    },
    filteredSearches() {
      if (this.filter == "") {
        return this.searches;
      }

      if (this.filterBy == "search_name") {
        return this.searches.filter(
          (search) =>
            search[this.filterBy]
              .toLowerCase()
              .indexOf(this.filter.trim().toLowerCase()) > -1
        );
      } else if (this.filterBy == "search_terms") {
        return this.searches.filter((search) =>
          search[this.filterBy].some(
            (term) => term.indexOf(this.filter.trim().toLowerCase()) > -1
          )
        );
      } else {
        return this.searches.filter((search) =>
          search[this.filterBy]
            .map(({ source_name }) => source_name.toLowerCase())
            .some((term) => term.indexOf(this.filter.trim().toLowerCase()) > -1)
        );
      }
    },
    isDisabled() {
      return !this.selected.length > 0;
    },
  },
  methods: {
    selectSearch(searchId) {
      if (this.selected.includes(searchId)) {
        this.selected = this.selected.filter((value) => value != searchId);
      } else {
        this.selected.push(searchId);
      }
    },
    deleteSearches() {
      this.$confirm.require({
        message:
          "Are you sure you would like to delete the selected searches? They will also be removed from newsletters.",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          return this.$store
            .dispatch("deleteSearch", { search_ids: this.selected })
            .then(() =>
              this.$toast.add({
                severity: "success",
                summary: "Searches Deleted",
                detail: "",
                life: 3000,
              })
            )
            .then((this.selected = []))
            .catch((error) =>
              this.messages.push({ severity: "error", content: error })
            );
        },
        reject: () => {},
      });
    },
    scrape(ids) {
      return this.$store.dispatch("runScraper", { search_ids: ids }).then(() =>
        this.$router.push({
          name: "searchResults",
          params: { passedSearches: ids },
        })
      );
    },
    createNewsletter() {
      return this.$router.push({
        name: "addNewsletter",
        params: { passedSearches: this.selected },
      });
    },
    viewHistory(searchId) {
      return this.$store
        .dispatch("getResults", { search_id: searchId })
        .then(() =>
          this.$router.push({
            name: "searchHistory",
            params: { searchId: searchId },
          })
        )
        .catch((error) =>
          this.messages.push({ severity: "error", content: error })
        );
    },
    receiveError(error) {
      return this.messages.push({ severity: "error", content: error });
    },
  },
};
</script>

<style scoped>
.p-button {
  background: transparent;
  color: #666;
  border-color: #bbbbbb;
}
</style>
