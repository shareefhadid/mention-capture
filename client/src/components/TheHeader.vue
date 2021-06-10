<template>
  <header class="section">
    <nav class="container">
      <TabMenu :model="pages" />
      <TabMenu :model="user" />

      <!-- <ul>
        <li v-if="loggedIn">
          <router-link :to="{ name: 'searches' }">Searches</router-link>
        </li>
        <li v-if="loggedIn">
          <router-link :to="{ name: 'newsletters' }">Newsletters</router-link>
        </li>
      </ul>
      <ul>
        <li v-if="!loggedIn">
          <router-link :to="{ name: 'login' }">Login</router-link>
        </li>
        <li v-if="!loggedIn">
          <router-link :to="{ name: 'register' }">Register</router-link>
        </li>
        <li v-if="loggedIn">
          <a href="#" @click.prevent="logout">Logout</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>

<script>
export default {
  name: "TheHeader",
  data() {
    return {
      pages: [
        {label: "Searches", to: "/", visible: () => this.loggedIn},
        {label: "Newsletters", to: "/newsletters", visible: () => this.loggedIn},
      ],
      user: [
        {label: "Login", to: "/login", visible: () => !this.loggedIn},
        {label: "Register", to: "/register", visible: () => !this.loggedIn},
        {label: "Logout", command: () => this.logout(), visible: () => this.loggedIn},
      ],
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
  },
  methods: {
    logout() {
      return this.$store
        .dispatch("logout")
        .then(() => this.$router.push({ name: "login" }));
    },
  },
};
</script>

<style scoped>
.section {
  background-color: #f4f4f4;
}

.container {
  display: flex;
  align-content: center;
  align-items: baseline;
  justify-content: space-between;
}


</style>
