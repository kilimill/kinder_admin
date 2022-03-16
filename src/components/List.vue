<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ info.title }}

  section.data
    .data__content
      .table__wrapper
        div(v-if="elemsOfPage.length")
          header.card__header
            p.card__header-title
              span.card__header-icon
                i.mdi.mdi-format-text.default
              span Список публикаций на главной
          .table__scroll
            table.table
              thead
                th Изображение
                th Заголовок
                th Категория
                th Дата
                th Статус
                th.controls &nbsp;
              tbody
                tr(v-for="item in elemsOfPage", :key="item.id")
                  td 
                    .card__pack(v-if="item.coverImage !== null")
                      img.card__form-img(:src="item.coverImage.url") 
                  td 
                    a(:href="'/calendar/' + item.url" target="_blank") {{ item.coverTitle }}
                  td {{ categoryToText(item.category) }}
                  td {{ item.releaseDate | moment('DD.MM.YYYY') }}
                  td 
                    span.media__meta-tag.media__meta-tag_green(v-if="item.published === 'PUBLISHED'") Опубликовано
                    span.media__meta-tag.media__meta-tag_green(v-if="item.published === 'PREPUBLISHED'") На препубликации
                    span.media__meta-tag.media__meta-tag_warning(v-if="item.published === 'UNPUBLISHED'") Скрыто
                  td 
                    <router-link :to="`/${info.url}/${item.id}`" class="button button_green table__profile">
                      span.icon.is-small
                        i.mdi.mdi-account-edit
                    </router-link>
                    <button type="button" class="button button_red table__profile" @click.prevent="postDelete(item.id)">
                      span.icon.is-small
                        i.mdi.mdi-trash-can
                    </button>
          .card__pagination-wrapper(v-if="totalPages > 1")
            sliding-pagination(
              :current="currentPage",
              :total="totalPages",
              @page-change="pageChangeHandler"
            )

        p.data__content-empty(v-else) Список публикаций на главной пуст

        .table__footer
          .table__footer-control
            button.button.button_green.button_href(
              type="button",
              @click.prevent="reloadPosts"
            ) Обновить список
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";

import SlidingPagination from "vue-sliding-pagination";

import Moment from "moment";
export default {
  props: {
    info: {
      type: Object
    }
  },
  components: {
    SlidingPagination,
    Moment,
  },
  computed: {
    ...mapGetters(["getToken"]),
    elemsOfPage() {
      let elems = this.posts.slice(0);
      return elems.splice(
        (this.currentPage - 1) * this.elemsPerPage,
        this.elemsPerPage
      );
    },
    totalPages() {
      let elems = this.posts.slice(0);
      return Math.ceil(elems.length / this.elemsPerPage);
    },
  },
  methods: {
    ...mapActions(["setToken"]),
    categoryToText(catNum) {
      const associate = {
        'FILMS_AND_ANIMATION': 'Фильмы и анимация',
        'WEEK_EVENTS': 'Мероприятия недели',
        'MOSCOW_AND_ST_PETERSBURG_TOURS': 'Туры по Москве и Спб',
        'HOME': 'Дом',
        'DOMESTIC_TOURS': ' Внутренние туры',
        'ACTIVE_ADVENTURES': 'Активные приключения',
      }
      return associate[catNum];
    },

    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      alert(error.response.data.message);
    },

    reloadPosts() {
      axios
        .get(`${URL}/api/admin/${this.info.url}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.posts = data;
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },

    postDelete(id) {
      axios
        .delete(`${URL}/api/admin/${this.info.url}/${+id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.reloadPosts();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },

    pageChangeHandler(selectedPage) {
      this.currentPage = selectedPage;
    },
  },
  mounted() {
    this.reloadPosts();
  },
  data() {
    return {
      currentPage: 1,
      elemsPerPage: 15,

      posts: [],
    };
  },
};
</script>