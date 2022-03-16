<template lang="pug">
section.content
  section.title
    ul.title__level-list
      li.title__level-item Админка
      li.title__level-item {{ info.title }}

  section.title__default(v-if="data")
    .info__page
      <router-link :to="`/${info.url}/`" class="button button_black mr">
        span назад
      </router-link>
      .status Статус:
        span &nbsp{{ publishedToText() }}
    .card__flex.mt_small
      form.mr(ref="editForm", @submit.prevent="editPost")
        .card__col
          .card__twist
            .card__content-flag.mr
              img.card__content-img(
                v-if="data.coverImage",
                :src="data.coverImage.url"
              ) 
              .card__form-wrapper
                label.card__form-button
                  input.card__form-file(
                    type="file",
                    name="coverImage",
                    accept="image/png,image/jpeg",
                    ref="coverImage"
                  )
                  span.input__file-icon-wrapper
                  span.input__file-button-text Обложка ссылки
            //- .card__content-flag(v-if="data.isInner === true")
            //-   img.card__content-img(
            //-     v-if="data.postImage",
            //-     :src="data.postImage.url"
            //-   ) 
            //-   .card__form-wrapper
            //-     label.card__form-button
            //-       input.card__form-file(
            //-         type="file",
            //-         name="postImage",
            //-         accept="image/png,image/jpeg",
            //-         ref="postImage"
            //-       )
            //-       span.input__file-icon-wrapper
            //-       span.input__file-button-text Обложка страницы
          .card__col.mt_small
            .card__controls
              .card__field
                label.form__label.card__label Дата
                  date-picker(
                    v-model="data.releaseDate",
                    valueType="DD-MM-YYYY",
                    :formatter="momentFormat",
                    :lang="lang",
                    @change="validate"
                  )
              label.card__label.card__label-ctr Категория
                select.select(name="category", v-model="data.category")
                  option(value="FILMS_AND_ANIMATION") Фильмы и анимация
                  option(value="WEEK_EVENTS") Мероприятия недели
                  option(value="MOSCOW_AND_ST_PETERSBURG_TOURS") Туры по Москве и Спб
                  option(value="HOME") Дом
                  option(value="DOMESTIC_TOURS") Внутренние туры
                  option(value="ACTIVE_ADVENTURES") Активные приключения
            .card__field
              label.card__label.card__label-checkbox Внутренняя ссылка
                input.card__checkbox(type="checkbox", v-model="data.isInner")
                span.card__checkboxstyle
            .card__field
              label.card__label.card__label-checkbox Cтатья должна быть опубликована в блоке экспертов?
                input.card__checkbox(type="checkbox", v-model="data.position")
                span.card__checkboxstyle
            label.card__label.mt_small Заголовок
              input.form__input.input(
                type="text",
                name="coverTitle",
                v-model="data.coverTitle",
                required
              )
            label.card__label.card__label-ctr(v-if="data.isInner === false") Ссылка
              input.form__input.input(
                type="text",
                name="url",
                v-model="data.url"
              )

          .mt_small(v-if="data.isInner === true")
            .card__col.mr
              .card__field
                label.form__label.card__label Title
                input.form__input.calendar__title(
                  name="postTitle",
                  v-model="data.postTitle"
                )
              .card__field
                label.form__label.card__label Description
                <editor apiKey="wgpgz5anz0b8pippxuiinaatxi4z6hk68dkk0royypdho3r7" :init="config" v-model="data.postDescription" />
              //- textarea.form__textarea.calendar__title(
              //-   name="postDescription",
              //-   v-model="data.postDescription",
              //-   required
              //- )

        .form__field(v-if="err !== ''")
          label.form__label.form__label_error {{ err }}
        footer.card__flex.mt_small
          button.button.button_blue.mr(
            type="button",
            @click.prevent="arrStatusChange('UNPUBLISHED')",
            v-if="data.published == 'PUBLISHED' || data.published == 'PREPUBLISHED'"
          ) Снять с публикации
          button.button.button_blue.mr(
            type="button",
            ref="statusBtn",
            :disabled="pubState",
            @click.prevent="arrStatusChange('PUBLISHED')",
            v-if="data.published == 'UNPUBLISHED'"
          ) Опубликовать
          button.button.button_blue.mr(
            type="button",
            ref="statusBtn",
            @click.prevent="arrStatusChange('PREPUBLISHED')",
            v-if="data.published == 'UNPUBLISHED'"
          ) Препубликация
          button.button.button_green.mr(ref="changeBtn", :disabled="disBtn") Изменить
          button.button.button_green.mr(
            v-if="data.isInner == true",
            @click.prevent="$refs.popup.popupOpen()"
          ) Добавить блок +

          button.button.button_red(type="button", @click.prevent="postDelete") Удалить

      Blocks(v-if="data.isInner === true")

    .card__loader(v-if="!data")
      span.loader
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
import Blocks from "@/components/layout/Blocks.vue";

import Moment from "moment";
import Popup from "@/components/layout/Popup.vue";

export default {
  components: {
    DatePicker,
    Blocks,
    Popup,
    editor: Editor,
  },
  props: {
    info: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["getToken", "getBlcoks"]),
  },
  data() {
    return {
      pubState: true,

      data: [],
      date: null,
      disBtn: false,

      err: "",

      config,

      momentFormat: {
        //[optional] Date to String
        stringify: (date) => {
          return date ? Moment(date).format("DD.MM.YYYY") : "";
        },
        //[optional]  String to Date
        parse: (value) => {
          return value ? Moment(value, "DD.MM.YYYY").toDate() : null;
        },
        //[optional] getWeekNumber
        getWeek: (date) => {
          return; // a number
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
  watch: {
    data() {
      this.validate();
    },
  },
  methods: {
    publishedToText() {
      const associate = {
        UNPUBLISHED: "Не опубликовано",
        PUBLISHED: "Опубликовано",
        PREPUBLISHED: "На препубликации",
      };
      return associate[this.data.published];
    },
    ...mapActions(["setToken", "setUser", "setUsers"]),
    ...mapMutations(["filterElems", "addElems", "clearArr"]),
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      } else if (error.response.data.message.includes("Duplicate entry")) {
        this.err = "Данный заголовок страницу уже используется";
      } else if (
        error.response.data.message === "ThrottlerException: Too Many Requests"
      ) {
        this.err = "Операция не удалась, повторите еще раз";
      } 
      else {
        alert(error.response.data.message);
      }
    },

    checkPublishedState() {
      if (this.data.isInner == false) {
        if (+this.data.url == 0) {
          this.pubState = true;
        } else {
          this.pubState = false;
        }
      } else {
        if (+this.data.postTitle == 0 || +this.data.postDescription == 0) {
          this.pubState = true;
        } else {
          this.pubState = false;
        }
      }
    },

    validate() {
      if (this.data.releaseDate !== null) {
        this.disBtn = false;
      } else {
        this.disBtn = true;
      }
    },

    arrStatusChange(state) {
      axios({
        method: "patch",
        url: `${URL}/api/admin/${this.info.url}/${+this.info.id}`,
        data: {
          published: state,
        },
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
        .then(() => {
          this.$router.push(`/${this.info.url}`);
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },

    editPost() {
      this.$refs.changeBtn.textContent = "Изменение...";
      if (this.err !== "") {
        this.err = "";
      }
      this.disBtn = true;
      let time = Moment(this.data.releaseDate, "DD.MM.YYYY").format(
        "YYYY-MM-DD"
      );
      let formData = new FormData(this.$refs.editForm);
      formData.append("releaseDate", time);
      formData.append("position", this.data.position);
      if (this.data.isInner === false) {
        formData.append("isInner", false);
      } else {
        this.filterElems();
        var json_arr = JSON.stringify(this.getBlcoks),
          text = String(this.data.postDescription);
        formData.append("postDescription", text);
        formData.append("blocks", json_arr);
        formData.append("isInner", true);
      }
      axios({
        method: "patch",
        url: `${URL}/api/admin/${this.info.url}/${this.info.id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .catch((error) => {
          this.errorFun(error);
        })
        .finally(() => {
          this.disBtn = false;
          this.$refs.changeBtn.textContent = "Изменить";
          this.clearArr();
          this.getPost();
        });
    },

    getPost() {
      axios
        .get(`${URL}/api/admin/${this.info.url}/${+this.info.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(({ data }) => {
          this.data = data;
          if (this.data.postDescription === null) {
            this.data.postDescription = "";
          }
        })
        .then(() => {
          this.data.releaseDate = Moment(this.data.releaseDate).format(
            "DD.MM.YYYY"
          );
          if (this.data.blocks) {
            this.data.blocks.forEach((item, index) => {
              item.position = index;
              this.addElems(item);
            });
          }
          this.checkPublishedState();
        })
        .catch((error) => this.errorFun(error));
    },

    postDelete() {
      axios
        .delete(`${URL}/api/admin/${this.info.url}/${+this.info.id}`, {
          headers: { Authorization: `Bearer ${this.getToken}` },
        })
        .then(() => {
          this.$router.push(`/${this.info.url}`);
        })
        .catch((error) => this.errorFun(error));
    },
  },
  mounted() {
    this.clearArr();
    this.getPost();
  },
  destroyed() {
    this.clearArr();
    delete localStorage.elems;
  },
};
</script>
