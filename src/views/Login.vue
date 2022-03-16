<template lang="pug">
section.fullheight.centered
  form.form(action="/login", method="POST")
    header.form__header
      p.form__header-title
        span.form__header-icon
          i.mdi.mdi-lock
        span Авторизация

    .form__content
      .form__field(v-if="err !== ''")
        label.form__label.form__label_error {{ err }}
      .form__field
        label.form__label(for="email") Имя
        input#email.form__input(
          type="text",
          name="name",
          v-model="name",
          required
        )
      .form__field
        label.form__label(for="password") Пароль
        input#password.form__input(
          type="password",
          name="password",
          v-model="password",
          required
        )

      hr

      button.button.button_black(type="submit", @click.prevent="auth") Войти
</template>

<script>
import { mapActions } from "vuex";

import axios from "axios";
import { URL } from "../helpers/constants";

export default {
  data() {
    return {
      name: "",
      password: "",
      err: "",
    };
  },
  methods: {
    ...mapActions(["setToken"]),
    auth() {
      axios
        .post(`${URL}/api/admin/authentication/login`, {
          username: this.name,
          password: this.password,
        })
        .then(({ data }) => {
          this.setToken(data.accessToken);
          this.$router.push("/");
        })
        .catch((err) => {
          this.err = String(err.response.data.message);
          alert(this.err)
        });
    },
  },
};
</script>
