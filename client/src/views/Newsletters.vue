<template>
  <div id="page">

    <div class="section title-section">
      <div class="container">
        <h1 id="page-title">Newsletters</h1>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <!-- GRID FILTER -->
        <div class="p-grid grid-filter">
          <div class="p-col-12">
            <div class="p-inputgroup">
              <InputText
                placeholder="Filter newsletters"
                v-model="filter"
                class="filter"
              />
              <span class="p-inputgroup-addon">
                <Dropdown
                  v-model="filterBy"
                  :options="filterOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Filter by"
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
            item="Newsletter"
            @click="$router.push({ name: 'addNewsletter' })"
          />
          <div
            v-for="newsletter in filteredNewsletters"
            :key="newsletter._id"
            class="grid-item"
          >
            <NewsletterItem
              :newsletter="newsletter"
              @send-error="receiveError"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewsletterItem from "../components/NewsletterItem.vue";
import AddNewGridItem from "../components/AddNewGridItem.vue";
export default {
  components: { NewsletterItem, AddNewGridItem },
  name: "Newsletters",
  data() {
    return {
      filter: "",
      filterBy: "name",
      filterOptions: [
        { label: 'by newsletter name', value: 'name' },
        { label: 'by recipient', value: 'emails' },
      ],
      messages: [],
    };
  },
  created() {
    this.$store
      .dispatch("getNewsletters")
      .then(() => {
        if (
          this.newsletters.some((newsletter) => newsletter.searches.length < 1)
        ) {
          return this.messages.push({
            severity: "error",
            content:
              "One or more newsletters do not contain any searches, please edit the flagged newsletters or they will not run.",
          });
        }
      })
      .catch((error) =>
        this.messages.push({ severity: "error", content: error })
      );
  },
  computed: {
    storeState() {
      return this.$store.state.searches;
    },
    newsletters() {
      return this.$store.state.newsletters;
    },
    filteredNewsletters() {
      if (this.filter == "") {
        return this.newsletters;
      }

      if (this.filterBy == "name") {
        return this.newsletters.filter(
          (newsletter) =>
            newsletter[this.filterBy]
              .toLowerCase()
              .indexOf(this.filter.trim().toLowerCase()) > -1
        );
      } else {
        return this.newsletters.filter((newsletter) =>
          newsletter[this.filterBy].some(
            (email) => email.indexOf(this.filter.trim().toLowerCase()) > -1
          )
        );
      }
    },
  },
  methods: {
    receiveError(error) {
      return this.messages.push({ severity: "error", content: error });
    },
  },
};
</script>

<style scoped></style>
