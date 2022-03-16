<template lang="pug">
section.popup
  .popup__bg(@click="popupClose")
  form.form.popup__form(ref="formBlocks", @submit.prevent="createBlock")
    button.popup__close(@click.prevent="popupClose")
      i.mdi.mdi-close.default
    .popup__inner
      div(v-if="selectCheck !== 'ONLY_VIDEO'")
        .card__field
          label.form__label.card__label Заголовок блока
          input.form__input.calendar__title(name="title", required)
        .card__field
          label.card__label Текст блока
          <editor apiKey="wgpgz5anz0b8pippxuiinaatxi4z6hk68dkk0royypdho3r7" :init="config" v-model='blockText' />
      .card__field(v-if="checkVideoCategory")
        label.form__label.card__label Ссылка на youtube
        input.form__input.calendar__title(name="video", required)
      .card__twist
        div(v-if="selectCheck !== 'ONLY_VIDEO' && selectCheck !== 'CENTRED'")
          .card__field-wrapper
            label.card__form-button
              input.card__form-file(
                name="image",
                type="file",
                accept="image/png,image/jpeg",
                @change="prev($event, '#blockImg', 'card__block-img')"
              )
              span.input__file-icon-wrapper
              span.input__file-button-text Картинка
          .mt_small
            span#blockImg.popup__image
        div
          .card__field-wrapper
            label.card__form-button
              input.card__form-file(
                name="icon",
                type="file",
                accept="image/png,image/jpeg",
                @change="prev($event, '#blockIcon', 'card__block-img')",
                ref="icon"
              )
              span.input__file-icon-wrapper
              span.input__file-button-text Иконка
          .mt_small
            span#blockIcon.popup__image

      .card__controls.popup__bottom
        label.card__label.card__label-ctr Вид блока
          select.select(name="category", v-model="selectCheck", required)
            option(value="CENTRED") По центру
            option(value="CENTRED_WITH_IMAGE") По центру с картинкой
            option(value="RIGHT_SIDE") Правая сторона
            option(value="LEFT_SIDE") Левая сторона
            option(value="ONLY_VIDEO") Только видео
            option(value="CENTRED_VIDEO") Видео по центру
            option(value="LEFT_SIDE_VIDEO") Видео слева
            option(value="RIGHT_SIDE_VIDEO") Видео справа
        button.button.button_green(:disabled="disBtn") Создать
        <button type="button" class="button button_red table__profile" @click.prevent="clearPopup">
          span.icon.is-small
            i.mdi.mdi-trash-can
        </button>
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";

import Editor from "@tinymce/tinymce-vue";
import config from "@/helpers/tinymce.config.js";

import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { mapMutations } from "vuex";
import { ppreview } from "@/helpers/index";
export default {
  components: {
    editor: Editor,
  },
  data() {
    return {
      disBtn: false,
      config,
      blockText: "",
      selectCheck: "",
    };
  },
  computed: {
    ...mapGetters(["getToken"]),
    checkVideoCategory() {
      let sel = this.selectCheck;
      if (
        sel == "ONLY_VIDEO" ||
        sel == "CENTRED_VIDEO" ||
        sel == "LEFT_SIDE_VIDEO" ||
        sel == "RIGHT_SIDE_VIDEO"
      ) {
        return true;
      } else {
        return false
      }
    },
  },
  methods: {
    ...mapActions(["setToken"]),
    ...mapMutations(["addElems"]),
    createBlock() {
      this.disBtn = true;
      const formData = new FormData(this.$refs.formBlocks);
      var json_arr = String(this.blockText);
      formData.append("text", json_arr);
      axios({
        method: "POST",
        url: `${URL}/api/admin/block`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then(({ data }) => {
          this.addElems(data);
          this.popupClose();
        })
        .catch((error) => {
          this.errorFun(error);
        })
        .finally(() => {
          this.disBtn = false;
        });
    },

    prev(e, qsClass, imgClass) {
      ppreview(e, qsClass, imgClass);
    },

    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      alert(error.response.data.message);
    },

    clearPopup() {
      this.$refs.formBlocks.reset();
      this.blockText = "";
      var ico = document.querySelectorAll(".popup__image");
      ico.forEach((item) => {
        item.innerHTML = "";
      });
    },

    popupClose() {
      this.clearPopup();
      document.querySelector(".popup").classList.remove("open");
    },

    popupOpen() {
      document.querySelector(".popup").classList.add("open");
    },
  },
};
</script>