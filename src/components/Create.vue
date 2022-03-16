<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ info.title }}

  section.title__default
    .card__flex
      form.form.mr(ref="form", @change="validate", @submit.prevent="sendPost")
        .card__field
          label.form__label.card__label Дата
            date-picker(
              v-model="date",
              valueType="DD-MM-YYYY",
              :formatter="momentFormat",
              :lang="lang",
              required
            )
        .card__field
          label.form__label.card__label Заголовок
            input.form__input(name="coverTitle", ref="coverTitle", required) 

        .card__controls
          .card__field
            label.card__label.card__label-ctr Категория
              select.select(name="category", ref="category")
                option(value="FILMS_AND_ANIMATION") Фильмы и анимация
                option(value="WEEK_EVENTS") Мероприятия недели
                option(value="MOSCOW_AND_ST_PETERSBURG_TOURS") Туры по Москве и Спб
                option(value="HOME") Дом
                option(value="DOMESTIC_TOURS") Внутренние туры
                option(value="ACTIVE_ADVENTURES") Активные приключения

          .card__field.card__field-wrapper
            span#pageIcon.card__form-preview(ref="pageIcon")
            label.card__form-button
              input.card__form-file(
                type="file",
                name="coverImage",
                accept="image/png,image/jpeg",
                @change="prev($event, '#pageIcon', 'card__block-img')",
                ref="linkImg"
              )
              span.input__file-icon-wrapper
              span.input__file-button-text Обложка ссылки
        .card__field
          label.card__label.card__label-checkbox Внутренняя ссылка
            input.card__checkbox(type="checkbox", v-model="insideCheck")
            span.card__checkboxstyle
        .card__field
          label.card__label.card__label-checkbox Cтатья должна быть опубликована в блоке экспертов?
            input.card__checkbox(type="checkbox", v-model="positionCheck")
            span.card__checkboxstyle
        .card__field(v-if="insideCheck === false")
          label.form__label.card__label Ссылка
            input.form__input(name="url", ref="url")
        //- .card__controls
          //- .card__field.card__field-wrapper(v-if="insideCheck === true")
          //-   span#headCover.card__form-preview
          //-   label.card__form-button
          //-     input.card__form-file(
          //-       type="file",
          //-       name="postImage",
          //-       accept="image/png,image/jpeg",
          //-       @change="prev($event, '#headCover', 'card__block-img')",
          //-       ref="postImage"
          //-     )
          //-     span.input__file-icon-wrapper
          //-     span.input__file-button-text Обложка страницы
        .card__info(v-if="insideCheck === true")
          .card__field
            label.form__label.card__label Заголовок страницы
            input.form__input.calendar__title(
              name="postTitle",
              v-model="postTitle"
            )
          .card__field
            label.form__label.card__label Описание страницы
            <editor apiKey="wgpgz5anz0b8pippxuiinaatxi4z6hk68dkk0royypdho3r7" :init="config" v-model="text" />
        .mt_small
          .form__field(v-if="err !== ''")
            label.form__label.form__label_error {{ err }}
          button.button.button_green.mr(:disabled="disBtn", ref="sendBtn") Создать
          button.button.button_green.mr(
            @click.prevent="$refs.popup.popupOpen()",
            v-if="insideCheck === true"
          ) Добавить блок +
          button.button.button_red(@click.prevent="clearForm") Очистить форму
      Blocks(:class="{ hidden: !insideCheck }")

  Popup(ref="popup")
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import config from "@/helpers/tinymce.config.js";
import Editor from "@tinymce/tinymce-vue";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { mapMutations } from "vuex";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

import { ppreview } from "@/helpers/index";

import Blocks from "@/components/layout/Blocks.vue";
import Moment from "moment";
import Popup from "@/components/layout/Popup.vue";
export default {
  props: {
    info: {
      type: Object,
    },
  },
  components: {
    editor: Editor,
    Moment,
    DatePicker,
    Blocks,
    Popup,
  },
  data() {
    return {
      disBtn: true,
      postTitle: "",

      insideCheck: false,
      positionCheck: false,
      text: "",

      err: "",

      config,
      date: "",

      momentFormat: {
        stringify: (date) => {
          return date ? Moment(date).format("DD-MM-YYYY") : "";
        },
        parse: (value) => {
          return value ? Moment(value, "DD-MM-YYYY").toDate() : null;
        },
        getWeek: (date) => {
          return;
        },
      },

      lang: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: true,
      },
    };
  },
  computed: {
    ...mapGetters(["getToken", "getBlcoks"]),
  },

  watch: {
    text() {
      this.validate();
    },
  },

  methods: {
    clearForm() {
      this.clearArr();
      delete localStorage.url;
      delete localStorage.date;
      delete localStorage.text;
      delete localStorage.postTitle;
      delete localStorage.coverTitle;
      delete localStorage.insideCheck;
      delete localStorage.category;
      delete localStorage.elems;
      this.$router.push(`/${this.info.url}`);
    },
    ...mapActions(["setToken"]),
    ...mapMutations(["filterElems", "clearArr"]),

    prev(e, qsClass, imgClass) {
      ppreview(e, qsClass, imgClass);
    },

    validate() {
      if (this.date !== "") {
        this.disBtn = false;
      } else {
        this.disBtn = true;
      }
      if (this.insideCheck == true) {
        localStorage.setItem("postTitle", this.postTitle);
        localStorage.setItem("text", this.text);
        localStorage.removeItem("url");
      } else {
        localStorage.setItem("url", this.$refs.url.value);
        localStorage.removeItem("postTitle");
        localStorage.removeItem("text");
      }
      localStorage.setItem("insideCheck", this.insideCheck);
      localStorage.setItem("date", this.date);
      localStorage.setItem("coverTitle", this.$refs.coverTitle.value);
      localStorage.setItem("category", this.$refs.category.value);
    },

    checkStorage() {
      this.insideCheck =
        localStorage.getItem("insideCheck") == "false" ? false : true;
      this.$refs.coverTitle.value = localStorage.getItem("coverTitle");
      this.$refs.category.value = localStorage.getItem("category");
      this.date = localStorage.getItem("date");
      if (this.insideCheck == true) {
        this.text = localStorage.getItem("text");
        this.postTitle = localStorage.getItem("postTitle");
      } else {
        this.$refs.url.value = localStorage.getItem("url");
      }
    },

    sendPost() {
      this.$refs.sendBtn.textContent = "Создание...";
      if (this.err !== "") {
        this.err = "";
      }
      this.disBtn = true;
      const formData = new FormData(this.$refs.form);
      let time = Moment(this.date, "DD.MM.YYYY").format("YYYY-MM-DD");
      formData.delete("date");
      formData.append("releaseDate", time);
      formData.append("position", this.positionCheck);
      if (this.insideCheck === false) {
        formData.append("isInner", false);
        if (+this.$refs.url.value == 0) {
          formData.delete("url");
        }
      } else {
        this.filterElems();
        var text = String(this.text),
          json_arr = JSON.stringify(this.getBlcoks);
        formData.delete("postTitle");
        formData.append("blocks", json_arr);
        if (this.postTitle !== "") {
          formData.append("postTitle", this.postTitle);
        }
        if (this.text == "") {
          formData.delete("postDescription");
        } else {
          formData.append("postDescription", text);
        }
        formData.append("isInner", true);
      }
      axios({
        method: "POST",
        url: `${URL}/api/admin/${this.info.url}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then(() => {
          this.clearForm();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },

    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      } else if (error.response.data.message.includes("Duplicate entry")) {
        this.err = "Данный заголовок страницу уже используется";
      } else {
        alert(error.response.data.message);
      }
    },
  },
  mounted() {
    if (
      localStorage.getItem("url") ||
      localStorage.getItem("date") ||
      localStorage.getItem("text") ||
      localStorage.getItem("postTitle") ||
      localStorage.getItem("coverTitle") ||
      localStorage.getItem("insideCheck") ||
      localStorage.getItem("category")
    ) {
      this.checkStorage();
    }
  },
};
</script>