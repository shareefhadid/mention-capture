<template>
  <div>
    <div class="item-top-container" @click="editNewsletter()">
      <a
        class="times-icon"
        href="delete-newsletter"
        @click.stop.prevent="deleteNewsletter()"
      >
        <font-awesome-icon icon="times" size="xs" />
      </a>
      <h2>
        <font-awesome-icon
          icon="exclamation-triangle"
          size="xs"
          class="exclamation-icon"
          v-if="hasNoSearches"
        />{{ newsletter.name }}
      </h2>
      <h3>Searches ({{ newsletter.searches.length }})</h3>
      <span v-if="hasNoSearches">&nbsp;</span>
      <div class="limit-terms">
        {{ searchNames }}
      </div>
      <h3>Recurrence</h3>
      <div class="limit-terms">
        {{ recurrence }}
      </div>
    </div>
    <div class="item-bottom-container">
      <Tag class="active-badge" :value="isActive" :severity="severity"></Tag>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsletterItem",
  props: {
    newsletter: Object,
  },
  computed: {
    searchNames() {
      return this.newsletter.searches
        .map((search_id) => {
          return this.getSearchName(search_id);
        })
        .join(", ");
    },
    isActive() {
      if (this.newsletter.active) {
        return "Active";
      } else return "Inactive";
    },
    severity() {
      if (this.newsletter.active) {
        return "info";
      } else return "danger";
    },
    recurrence() {
      const date = new Date(this.newsletter.start_date);
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const day = date.toLocaleDateString(undefined, {
        weekday: "short",
      });
      return `${day} ${time}, ${this.newsletter.interval}`;
    },
    hasNoSearches() {
      return this.newsletter.searches.length < 1;
    },
  },
  methods: {
    getSearchName(id) {
      const search = this.$store.state.searches.find(
        (search) => search._id === id
      );
      if (search) {
        return search.search_name;
      } else return;
    },
    editNewsletter() {
      this.$store.commit("setNewsletter", { newsletter: this.newsletter });
      return this.$router.push({ name: "editNewsletter" });
    },
    deleteNewsletter() {
      this.$confirm.require({
        message: "Are you sure you would like to delete this newsletter?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          return this.$store
            .dispatch("deleteNewsletter", { name: this.newsletter.name })
            .then(() =>
              this.$toast.add({
                severity: "success",
                summary: "Newsletter Deleted",
                detail: "",
                life: 3000,
              })
            )
            .catch((error) => this.$emit("send-error", error));
        },
        reject: () => {},
      });
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
.active-badge {
  display: inline-block;
  margin: 4px;
}
.times-icon:hover {
  color: hsla(210, 30%, 20%, 0.7);
}
.exclamation-icon {
  color: rgb(255, 58, 58);
  margin-right: 4px;
}
.item-bottom-container p {
  margin-left: 10px;
  color: #888;
}
.p-tag {
  margin-left: 8px;
}
</style>
