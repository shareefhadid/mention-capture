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

      <div class="input-header">
        <h2>Newsletter Name</h2>
        <div
          class="tooltip"
          v-tooltip.right="'Unique name to identify your newsletter'"
        >
          <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
        </div>
      </div>
      <InputText
        type="text"
        v-model="newsletterName"
        placeholder="Newsletter Name"
        :class="{
          'p-invalid': validationMessages.hasOwnProperty('name'),
        }"
      />
      <!-- ERROR VALIDATION -->
      <div v-for="(message, index) of validationMessages['name']" :key="index">
        <div class="error-message">{{ message }}</div>
      </div>

      <div class="input-header">
        <h2>Newsletter Title</h2>
        <div
          class="tooltip"
          v-tooltip.right="
            'This title will be displayed at the top of the newsletter email'
          "
        >
          <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
        </div>
      </div>
      <InputText
        type="text"
        v-model="newsletterTitle"
        placeholder="Newsletter Title"
        :class="{ 'p-invalid': validationMessages.hasOwnProperty('title') }"
      />
      <!-- ERROR VALIDATION -->
      <div v-for="(message, index) of validationMessages['title']" :key="index">
        <div class="error-message">{{ message }}</div>
      </div>

      <div class="input-header">
        <h2>Emails</h2>
        <div
          class="tooltip"
          v-tooltip.right="
            'Please enter a comma separated list of emails (i.e. email1@gmail.com, email2@gmail.com)'
          "
        >
          <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
        </div>
      </div>
      <Chips
        v-model="emails"
        separator=","
        :allowDuplicate="false"
        :addOnBlur="true"
        :max="50"
        :placeholder="
          emails.length < 1 ? 'Recipient Emails (Comma Separated)' : ''
        "
        :class="{ 'p-invalid': validationMessages.hasOwnProperty('emails') }"
      />
      <!-- ERROR VALIDATION -->
      <div
        v-for="(message, index) of validationMessages['emails']"
        :key="index"
      >
        <div class="error-message">{{ message }}</div>
      </div>

      <div class="p-grid">
        <div class="p-col-6">
          <div class="input-header">
            <h2>Searches</h2>
            <div
              class="tooltip"
              v-tooltip.right="
                'Articles will be drawn from the selected searches and included in the newsletter'
              "
            >
              <font-awesome-icon
                icon="info-circle"
                class="info-icon"
                size="sm"
              />
            </div>
          </div>
          <MultiSelect
            v-model="selectedSearches"
            :options="searchNames"
            optionLabel="search"
            optionValue="id"
            placeholder="Select Searches"
            display="chip"
            :class="{
              'p-invalid': validationMessages.hasOwnProperty('searches'),
            }"
          />
          <!-- ERROR VALIDATION -->
          <div
            v-for="(message, index) of validationMessages['searches']"
            :key="index"
          >
            <div class="error-message">{{ message }}</div>
          </div>
        </div>
        <div class="p-col-6">
          <div class="input-header">
            <h2>Recurrence</h2>
            <div
              class="tooltip"
              v-tooltip.right="
                'How often the newsletter will send if there is a sufficient number of new results'
              "
            >
              <font-awesome-icon
                icon="info-circle"
                class="info-icon"
                size="sm"
              />
            </div>
          </div>
          <Dropdown
            v-model="selectedRecurrence"
            :options="recurrenceOptions"
            optionLabel="recurrence"
            placeholder="Select an interval"
          />
        </div>

        <div class="p-col-6">
          <div class="input-header">
            <h2>Start Date</h2>
            <div
              class="tooltip"
              v-tooltip.right="
                'The date that the first newsletter will be sent'
              "
            >
              <font-awesome-icon
                icon="info-circle"
                class="info-icon"
                size="sm"
              />
            </div>
          </div>
          <Calendar
            v-model="selectedDate"
            dateFormat="dd.mm.yy"
            :showTime="true"
            hourFormat="12"
            :class="{
              'p-invalid': validationMessages.hasOwnProperty('start_date'),
            }"
            placeholder="DD.MM.YYYY HH:MM AM/PM'"
          />
          <!-- ERROR VALIDATION -->
          <div
            v-for="(message, index) of validationMessages['start_date']"
            :key="index"
          >
            <div class="error-message">{{ message }}</div>
          </div>
        </div>

        <div class="p-col-6">
          <div class="input-header">
            <h2>Number of Results</h2>
            <div
              class="tooltip"
              v-tooltip.right="
                'Set the minimum number of results required to send the newsletter and maximum that will be displayed.'
              "
            >
              <font-awesome-icon
                icon="info-circle"
                class="info-icon"
                size="sm"
              />
              <h2 style="color: #888; font-size: 16px">
                &nbsp;(min: {{ resultMinMax[0] }}, max: {{ resultMinMax[1] }})
              </h2>
            </div>
          </div>
          <Slider v-model="resultMinMax" :range="true" :min="1" :max="20" />
        </div>
      </div>
      <div class="p-col-6">
        <div class="input-header">
          <h2>Active</h2>
          <div
            class="tooltip"
            v-tooltip.right="
              'Newsletter will only be sent if this is toggled on. This will allow you to disable newsletters without needing to delete them.'
            "
          >
            <font-awesome-icon icon="info-circle" class="info-icon" size="sm" />
          </div>
        </div>
        <InputSwitch v-model="active" />
      </div>
    </div>
    <Dialog
      header="Test Newsletter Recipients"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <Chips
        v-model="testEmails"
        separator=","
        :allowDuplicate="false"
        :addOnBlur="true"
        :max="10"
        :placeholder="
          testEmails.length < 1 ? 'Recipient Emails (Comma Separated)' : ''
        "
        :class="{
          'p-invalid': validationMessages.hasOwnProperty('testEmails'),
        }"
      />
      <div
        v-for="(message, index) of validationMessages['testEmails']"
        :key="index"
      >
        <div class="error-message">{{ message }}</div>
      </div>

      <template #footer>
        <Button
          class="p-button-md p-button-primary"
          label="Send Test"
          @click="sendTest()"
        />
      </template>
    </Dialog>

    <!-- FOOTER -->
    <div id="footer-section">
      <div id="footer-container">
        <Button
          class="p-button-md p-button-primary"
          label="Cancel"
          @click="cancel()"
        />
        <Button
          class="p-button-md p-button-primary"
          label="Save"
          @click="saveNewsletter()"
        />
        <Button
          class="p-button-md p-button-primary"
          label="Select Test Recipients"
          @click="openModal()"
        />
      </div>
    </div>
  </div>
</template>

<script>
const {
  newsletterValidation,
  testNewsletterValidation,
} = require("@/validation/validation.js");

import axios from "axios";

export default {
  name: "Newsletter",
  props: { passedSearches: Array },
  data() {
    return {
      messages: [],
      newsletter_id: "",
      newsletterName: "",
      newsletterTitle: "",
      emails: [],
      selectedSearches: [],
      selectedRecurrence: { recurrence: "One Time" },
      recurrenceOptions: [
        { recurrence: "One Time" },
        { recurrence: "Daily" },
        { recurrence: "Weekly" },
        { recurrence: "Monthly" },
        { recurrence: "Quarterly" },
        { recurrence: "Annually" },
      ],
      selectedDate: new Date(),
      active: true,
      resultMinMax: [1, 10],
      displayModal: false,
      testEmails: [],
      validationMessages: {},
    };
  },
  created() {
    this.$store
      .dispatch("getSearches")
      .catch((error) =>
        this.messages.push({ severity: "error", content: error })
      );

    if (this.$route.name === "editNewsletter") {
      this.newsletter_id = this.$store.state.newsletter._id;
      this.newsletterName = this.$store.state.newsletter.name;
      this.newsletterTitle = this.$store.state.newsletter.title;
      this.emails = this.$store.state.newsletter.emails;
      this.selectedSearches = this.$store.state.newsletter.searches;
      this.active = this.$store.state.newsletter.active;
      this.selectedRecurrence = {
        recurrence: this.$store.state.newsletter.interval,
      };
      this.selectedDate = new Date(this.$store.state.newsletter.start_date);
      this.resultMinMax = [
        this.$store.state.newsletter.min_results,
        this.$store.state.newsletter.max_results,
      ];
    }
    if (this.passedSearches) {
      this.passedSearches.forEach((searchId) =>
        this.selectedSearches.push(searchId)
      );
    }
    return
  },
  computed: {
    searchNames() {
      return this.$store.state.searches.map(({ search_name, _id }) => ({
        search: search_name,
        id: _id,
      }));
    },
    payload() {
      if (this.$route.name === "editNewsletter") {
        return {
          _id: this.newsletter_id,
          name: this.newsletterName,
          title: this.newsletterTitle,
          emails: this.emails,
          searches: this.selectedSearches,
          max_results: this.resultMinMax[1],
          min_results: this.resultMinMax[0],
          interval: this.selectedRecurrence.recurrence,
          start_date: this.selectedDate,
          active: this.active,
        };
      } else {
        return {
          name: this.newsletterName,
          title: this.newsletterTitle,
          emails: this.emails,
          searches: this.selectedSearches,
          max_results: this.resultMinMax[1],
          min_results: this.resultMinMax[0],
          interval: this.selectedRecurrence.recurrence,
          start_date: this.selectedDate,
          active: this.active,
        };
      }
    },
  },
  methods: {
    cancel() {
      return this.$router.go(-1);
    },
    saveNewsletter() {
      // RESETS VALIDATION ERRORS. PASSES PAYLOAD FOR VALIDATION. SETS NEW VALIDATION ERRORS
      this.validationMessages = {};
      const { error } = newsletterValidation(this.payload);
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
      if (this.$route.name === "editNewsletter") {
        newOrUpdate = axios.put("/api/newsletter", this.payload);
      } else {
        newOrUpdate = axios.post("/api/newsletter", this.payload);
      }

      newOrUpdate
        .then(() =>
          this.$toast.add({
            severity: "success",
            summary: "Newsletter Saved",
            detail: "",
            life: 3000,
          })
        )
        .then(() => this.$router.push({ name: "newsletters" }))
        .catch((error) => {
          if (error.response.data.searchNoExists) {
            // ARRAY OF STRINGS CONTAINING ID OF SEARCHES THAT COULD NOT BE FOUND IN SEARCH COLLECTION
            const missingSearchIds = error.response.data.searchNoExists;

            // INITALIZE EMPTY ARRAY TO STORE NAMES OF MISSING SEARCHES
            let missingSearchNames = [];

            // APPEND MISSING SEARCH NAMES BY MISSING IDS
            missingSearchIds.forEach((id) => {
              for (const search of this.searchNames) {
                if (id === search.id) {
                  missingSearchNames.push(` ${search.search}`);
                  break;
                } else continue;
              }
            });
            this.messages.push({
              severity: "error",
              content: `The following searches could not be found: ${missingSearchNames}. They may have been removed by another user, please de-select them before saving.`,
            });
          } else {
            this.messages.push({
              severity: "error",
              content: error.response.data,
            });
          }
        })
        .finally(() => this.$store.commit("removeLoading"));
    },
    sendTest() {
      this.validationMessages = {};
      const { error } = testNewsletterValidation({
        title: this.newsletterTitle,
        testEmails: this.testEmails,
        searches: this.selectedSearches,
        max_results: this.resultMinMax[1],
      });
      if (error) {
        error.details.forEach(({ path }) => {
          let messages = error.details
            .filter((val) => val.path[0] === path[0])
            .map(({ message }) => message);
          messages = [...new Set(messages)];
          this.validationMessages[path[0]] = messages;
        });
        return;
      } else this.displayModal = false;
      this.$store.commit("setLoading");
      axios
        .post("/api/newsletter/test", {
          newsletter: {
            title: this.newsletterTitle,
            searches: this.selectedSearches,
            max_results: this.resultMinMax[1],
          },
          testEmails: this.testEmails,
        })
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: "Test Newsletter Sent",
            detail: "",
            life: 3000,
          });
        })
        .catch((error) => {
          this.messages.push({ severity: "error", content: error });
        })
        .finally(() => this.$store.commit("removeLoading"));
    },
    openModal() {
      this.validationMessages = {};
      const { error } = newsletterValidation(this.payload);
      if (error) {
        error.details.forEach(({ path }) => {
          let messages = error.details
            .filter((val) => val.path[0] === path[0])
            .map(({ message }) => message);
          messages = [...new Set(messages)];
          this.validationMessages[path[0]] = messages;
        });
      } else return (this.displayModal = true);
    },
  },
};
</script>

<style scoped>
.p-multiselect,
.p-dropdown,
.p-calendar,
.p-slider {
  width: 90%;
}
.p-slider {
  margin-top: 16px;
}
.p-inputtext {
  width: 100%;
}
.p-chips {
  display: block;
  width: 100%;
}

.p-button {
  background: transparent;
  color: #666;
  border-color: #bbbbbb;
}
</style>
