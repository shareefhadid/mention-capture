<template>
  <div class="section">
    <div class="container">
      <!-- RENDER MESSAGES (ERRORS FROM BACKEND, ETC.) -->
      <Message
        v-for="(msg, index) of messages"
        :severity="msg.severity"
        :key="index"
        >{{ msg.content }}</Message
      >

      <div class="form">
        <h1 id="page-title">Login</h1>
        <form action="#" @submit.prevent="login">
          <!-- USERNAME FIELD -->
          <div class="form-control">
            <InputText
              type="text"
              v-model="name"
              placeholder="Username"
              :class="{
                'p-invalid': validationMessages.hasOwnProperty('name'),
              }"
            />
          </div>
          <div
            v-for="(message, index) of validationMessages['name']"
            :key="index"
          >
            <div class="error-message">{{ message }}</div>
          </div>

          <!-- PASSWORD FIELD -->
          <div class="form-control">
            <Password
              v-model="password"
              toggleMask
              placeholder="Password"
              :feedback="false"
              :class="{
                'p-invalid': validationMessages.hasOwnProperty('password'),
              }"
            />

            <div
              v-for="(message, index) of validationMessages['password']"
              :key="index"
            >
              <div class="error-message">{{ message }}</div>
            </div>
          </div>

          <Button
            type="submit"
            label="Login"
            class="p-button-md p-button-primary submit-button"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
const { loginValidation } = require("@/validation/validation.js");

export default {
  name: "Login",
  data() {
    return {
      name: "",
      password: "",
      messages: [],
      validationMessages: {},
    };
  },
  methods: {
    login() {
      // RESETS VALIDATION ERRORS. PASSES PAYLOAD FOR VALIDATION. SETS NEW VALIDATION ERRORS
      this.validationMessages = {};
      const { error } = loginValidation({
        name: this.name,
        password: this.password,
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

      return this.$store
        .dispatch("login", { name: this.name, password: this.password })
        .catch((error) =>
          this.messages.push({ severity: "error", content: error })
        );
    },
  },
};
</script>

<style scoped>
#page-title {
  margin-bottom: 24px;
}

.form-control {
  margin-top: 12px;
}

.submit-button {
  margin-top: 18px;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
}

.form {
  display: inline-block;
  width: 375px;
  padding: 16px 32px 32px 32px;
  border-radius: 8px;
  border: solid 1px #ced4da;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
}
</style>