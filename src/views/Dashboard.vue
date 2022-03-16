<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка

  section.title__bar.title__default {{ title }}

  section.dashboard
    ul.tiles
      li.tile
        .dashboard__info
          .dashboard__item
            .dashboard__widget
              p.dashboard__subtitle Публикаций в календаре
              p.dashboard__title {{ posts.length }}
          .dashboard__item
            span.dashboard__icon.is-large.dashboard__icon_peoples
              i.mdi.mdi-postage-stamp.mdi-48px
      li.tile
        .dashboard__info
          .dashboard__item
            .dashboard__widget
              p.dashboard__subtitle Публикаций на главной
              p.dashboard__title {{ articles.length }}
          .dashboard__item
            span.dashboard__icon.is-large.dashboard__icon_peoples
              i.mdi.mdi-format-text.mdi-48px

</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import axios from "axios";
import { URL } from "@/helpers/constants";

export default {
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    ...mapActions(["setToken"]),
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      alert(error.response.data.message);
    },
    reloadPosts() {
      axios
        .get(`${URL}/api/admin/post`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.posts = data;
        })
        .catch(this.errorFun);
    },
    reloadArticles() {
      axios
        .get(`${URL}/api/admin/article`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.articles = data;
        })
        .catch(this.errorFun);
    },
  },
  mounted() {
    this.reloadPosts();
    this.reloadArticles();
  },
  data() {
    return {
      title: "Главная Админка",
      posts: [],
      articles: [],
    };
  },
};
</script>