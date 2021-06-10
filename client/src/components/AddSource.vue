<template>
  <div class="p-grid">
    <div class="p-col-3">
      <InputText
        type="text"
        placeholder="Source Name (i.e. CBC)"
        @keyup="updateSource()"
        v-model="source"
        :class="{
          'p-invalid': validationMessages.hasOwnProperty('source_name'),
        }"
      />

      <div
        v-for="(message, index) of validationMessages['source_name']"
        :key="index"
      >
        <div class="error-message">{{ message }}</div>
      </div>
    </div>
    <div class="p-col-8">
      <InputText
        type="text"
        ref="rss"
        placeholder="RSS URL (i.e. https://www.example.com/rss)"
        v-model="rss"
        @keyup="updateSource()"
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
    <div id="p-delete-update" class="p-col">
      <Button
        class="p-button-md p-button-danger"
        icon="pi pi-times"
        @click="deleteSource()"
      />
    </div>
  </div>
</template>

<script>
import { sourceValidation } from "@/validation/validation.js";
export default {
  name: "AddSource",
  props: {
    sourceProp: String,
    rssProp: String,
    index: Number,
  },
  data() {
    return {
      source: this.sourceProp,
      rss: this.rssProp,
      validationMessages: {},
    };
  },
  watch: {
    sourceProp: function(newVal) {
      return (this.source = newVal);
    },
    rssProp: function(newVal) {
      return (this.rss = newVal);
    },
  },
  methods: {
    deleteSource() {
      return this.$emit("send-source-index", this.index);
    },
    updateSource() {
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
      }
      return this.$emit("send-source", {
        index: this.index,
        source: this.source,
        rss: this.rss,
      });
    },
  },
};
</script>

<style>
.p-inputtext {
  width: 100%;
}

#p-delete-update {
  justify-content: space-between;
}
</style>
