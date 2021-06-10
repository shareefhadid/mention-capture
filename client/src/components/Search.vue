<template>
  <div class="section">
    <div class="container">
      <h1 id="page-title">{{ $route.meta.title }}</h1>
      <!-- RENDER MESSAGES (ERRORS FROM BACKEND, ETC.) -->
      <Message
        v-for="(msg, index) of messages"
        :severity="msg.severity"
        :key="index"
        >{{ msg.content }}</Message
      >

      <!-- SEARCH NAME FIELD -->
      <div class="input-header">
        <h2>Search Name</h2>

        <div
          class="tooltip"
          v-tooltip.right="'Unique name to identify your search'"
        >
          <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
        </div>
      </div>

      <InputText
        type="text"
        v-model="searchName"
        placeholder="Search Name"
        :class="{
          'p-invalid': validationMessages.hasOwnProperty('search_name'),
        }"
      />

      <div
        v-for="(message, index) of validationMessages['search_name']"
        :key="index"
      >
        <div class="error-message">{{ message }}</div>
      </div>

      <!-- SOURCES FIELD -->
      <div class="input-header">
        <h2>Sources</h2>

        <div
          class="tooltip"
          v-tooltip.right="'Articles will be drawn from these sources'"
        >
          <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
        </div>

        <!-- SOURCE NAME -->
        <div class="p-grid source-field-grid">
          <div class="p-col-3">
            <AutoComplete
              v-model="source"
              :suggestions="filteredSourceList"
              @complete="searchSources($event)"
              @item-select="selectSource($event)"
              field="name"
              :dropdown="true"
            />

            <div
              v-for="(message, index) of validationMessages['source_name']"
              :key="index"
            >
              <div class="error-message">{{ message }}</div>
            </div>
            <div
              v-for="(message, index) of validationMessages['sources']"
              :key="index"
            >
              <div class="error-message">{{ message }}</div>
            </div>
          </div>

          <!-- SOURCE URL -->
          <div class="p-col-8">
            <InputText
              type="text"
              ref="rss"
              placeholder="RSS URL (i.e. https://www.example.com/rss)"
              @keyup.enter="addSource()"
              v-model="rss"
              :class="{
                'p-invalid': validationMessages.hasOwnProperty('source_url'),
              }"
            />
            <div
              v-for="(message, index) of validationMessages['source_url']"
              :key="index"
            >
              <div class="error-message">{{ message }}</div>
            </div>
          </div>

          <div class="p-col">
            <Button
              class="p-button-md"
              icon="pi pi-plus"
              @click.prevent="addSource()"
              :disabled="sourceDisabled"
            />
          </div>
        </div>

        <!-- SOURCE ARRAY -->
        <div v-for="(item, index) in sourceArray" :key="index">
          <AddSource
            :index="index"
            :sourceProp="item.source_name"
            :rssProp="item.source_url"
            @send-source-index="deleteSource"
            @send-source="updateSource"
          />
        </div>
      </div>

      <!-- SEARCH TERMS FIELD -->
      <div class="input-header">
        <h2>Search Terms</h2>

        <div
          class="tooltip"
          v-tooltip.right="
            'Please enter a comma separated list of search terms. Searches are case-insensitive and match full words (i.e. cat will not return cats)'
          "
        >
          <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
        </div>
      </div>

      <Chips
        v-model="termArray"
        separator=","
        :allowDuplicate="false"
        :addOnBlur="true"
        :max="100"
        :placeholder="
          termArray.length < 1 ? 'Search Terms (Optional, Comma Separated)' : ''
        "
        :class="{
          'p-invalid': validationMessages.hasOwnProperty('search_terms'),
        }"
      />

      <div
        v-for="(message, index) of validationMessages['search_terms']"
        :key="index"
      >
        <div class="error-message">{{ message }}</div>
      </div>
    </div>

    <!-- FOOTER -->
    <div id="footer-section">
      <div id="footer-container">
        <Button
          class="p-button-md p-button-primary footer-button"
          label="Cancel"
          @click="cancel()"
        />
        <Button
          class="p-button-md p-button-primary footer-button"
          label="Save"
          @click="saveSearch()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddSource from "@/components/AddSource.vue";
const {
  searchValidation,
  sourceValidation,
} = require("@/validation/validation.js");

import axios from "axios";

export default {
  name: "Search",
  components: { AddSource },
  data() {
    return {
      searchName: "",
      filteredSourceList: [],
      sourceArray: [],
      termArray: [],
      source: "",
      rss: "",
      messages: [],
      validationMessages: {},
    };
  },
  created() {
    if (this.$route.name === "editSearch") {
      this.searchName = this.$store.state.search.search_name;
      this.sourceArray = this.$store.state.search.sources;
      this.termArray = this.$store.state.search.search_terms;
      this.$store.state.search.bad_urls.forEach((badUrl) =>
        this.messages.push({ severity: "error", content: badUrl })
      );
    } else return;
  },
  computed: {
    sourceList() {
      let sourceList = this.$store.state.sourceList;
      sourceList.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      return sourceList;
    },
    sourceDisabled() {
      return !this.source.trim().length > 0 || !this.rss.trim().length > 0;
    },
    payload() {
      if (this.$route.name === "editSearch") {
        return {
          _id: this.$store.state.search._id,
          search_name: this.searchName,
          search_terms: this.termArray,
          sources: this.sourceArray,
        };
      } else {
        return {
          search_name: this.searchName,
          search_terms: this.termArray,
          sources: this.sourceArray,
        };
      }
    },
  },
  methods: {
    searchSources(event) {
      setTimeout(() => {
        if (event.query.trim().length < 1) {
          this.filteredSourceList = [...this.sourceList];
        } else {
          this.filteredSourceList = this.sourceList.filter((source) => {
            return source.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }
      }, 250);
    },
    selectSource(event) {
      this.source = event.value.name;
      this.rss = event.value.url;
      this.addSource();
    },
    addSource() {
      // RESETS VALIDATION ERRORS. PASSES PAYLOAD FOR VALIDATION. SETS NEW VALIDATION ERRORS
      this.validationMessages = {};
      const { error } = sourceValidation({
        source_name: this.source,
        source_url: this.rss,
      });
      if (error) {
        error.details.forEach(({ path }) => {
          let messages = error.details
            .filter((val) => val.path[0] === path[0])
            .map(({ message }) => message);
          messages = [...new Set(messages)];
          return (this.validationMessages[path[0]] = messages);
        });
        return;
      }

      if (!this.source.trim().length > 0 || !this.rss.trim().length > 0) return;
      this.sourceArray.push({
        source_name: this.source,
        source_url: this.rss,
      });
      this.source = "";
      this.rss = "";
      return;
    },
    deleteSource(index) {
      return this.sourceArray.splice(index, 1);
    },
    updateSource({ index, source, rss }) {
      return (this.sourceArray[index] = {
        source_name: source,
        source_url: rss,
      });
    },
    cancel() {
      return this.$router.go(-1);
    },
    saveSearch() {
      // RESETS VALIDATION ERRORS. PASSES PAYLOAD FOR VALIDATION. SETS NEW VALIDATION ERRORS
      this.validationMessages = {};
      const { error } = searchValidation(this.payload);
      if (error) {
        error.details.forEach(({ path }) => {
          let messages = error.details
            .filter((val) => val.path[0] === path[0])
            .map(({ message }) => message);
          messages = [...new Set(messages)];
          return (this.validationMessages[path[0]] = messages);
        });
        return;
      }

      this.$store.commit("setLoading");
      let newOrUpdate;
      if (this.$route.name === "editSearch") {
        newOrUpdate = axios.put("/api/search", this.payload);
      } else {
        newOrUpdate = axios.post("/api/search", this.payload);
      }

      newOrUpdate
        .then(() =>
          this.$toast.add({
            severity: "success",
            summary: "Search Saved",
            detail: "",
            life: 3000,
          })
        )
        .then(() => this.$router.push({ name: "searches" }))
        .catch((error) =>
          this.messages.push({
            severity: "error",
            content: error.response.data,
          })
        )
        .finally(() => this.$store.commit("removeLoading"));
    },
  },
};
</script>

<style scoped>
.times-circle-icon {
  color: #888;
  transition: all 0.3s ease;
  display: inline-block;
}

.times-circle-icon:hover {
  color: #333;
  cursor: pointer;
}

.source-times-icon {
  margin-bottom: 12px;
  margin-left: 12px;
}

.p-chips {
  display: block;
  width: 100%;
}

.p-inputtext {
  width: 100%;
}

.source-field-grid .p-button {
  min-width: 100%;
}

.footer-button {
  background: transparent;
  color: #666;
  border-color: #bbbbbb;
}
</style>
