<template lang="pug">
section.blocks
  .dragula
    form#preview.form.card__block.hide.itemRow(
      v-if="getElems.length !== 0",
      v-for="(item, index) in getElems",
      :key="item.id",
      :data-id="item.position",
      @submit.prevent="editBlock(item.id, item.position)"
    )
      .card__block-preview
        .card__block-short(v-if="item.category !== 'ONLY_VIDEO'")
          img.card__block-ico.mr(v-if="item.icon", :src="item.icon.url")
          .card__block-title(v-if="item.title") {{ item.title.slice(0, 19) }}
          .card__block-descr(v-if="item.text", v-html="item.text.slice(0, 19)")
        .card__block-short(v-else)
          img.card__block-ico.mr(v-if="item.icon", :src="item.icon.url")
          .card__block-title(v-if='item.video') {{ item.video.slice(0, 19) }}
        i.mdi.mdi-arrow-up-bold-circle-outline.card__block-arr(
          @click.prevent="hideBlock(item.position)"
        )

      .card__block-inner
        p.card__block-number Блок {{ index + 1 }}
        div(v-if="item.category !== 'ONLY_VIDEO'")
          .card__field
            label.form__label.card__label Заголовок блока
            input.form__input.calendar__title(
              v-model="item.title",
              name="title",
              required
            ) 
          .card__field
            label.card__label Текст блока
            <editor apiKey="wgpgz5anz0b8pippxuiinaatxi4z6hk68dkk0royypdho3r7" :init="config" v-model="item.text" />
        .card__field(v-if='item.category == "ONLY_VIDEO" || item.category == "CENTRED_VIDEO" || item.category == "LEFT_SIDE_VIDEO" || item.category == "RIGHT_SIDE_VIDEO"')
          label.form__label.card__label Ссылка на youtube
          input.form__input.calendar__title(
            name="video",
            v-model="item.video",
            required
          )
        .card__twist
          div(
            v-if="item.category !== 'CENTRED' && item.category !== 'ONLY_VIDEO'"
          )
            .card__field-wrapper
              label.card__form-button
                input.card__form-file(
                  name="image",
                  type="file",
                  accept="image/png,image/jpeg",
                  ref="forBlockImg"
                )
                span.input__file-icon-wrapper
                span.input__file-button-text Картинка
            .mt_small
              img.card__block-ico(v-if="item.image", :src="item.image.url")

          div
            .card__field-wrapper
              label.card__form-button
                input.card__form-file(
                  name="icon",
                  type="file",
                  accept="image/png,image/jpeg"
                )
                span.input__file-icon-wrapper
                span.input__file-button-text Иконка
            .mt_small
              img.card__block-ico(v-if="item.icon", :src="item.icon.url")

        hr
        .card__controls
          label.card__label.card__label-ctr Вид блока
            select.select(name="category", v-model="item.category")
              option(value="CENTRED") По центру
              option(value="CENTRED_WITH_IMAGE") По центру с картинкой
              option(value="RIGHT_SIDE") Правая сторона
              option(value="LEFT_SIDE") Левая сторона
              option(value="ONLY_VIDEO") Только видео
              option(value="CENTRED_VIDEO") Видео по центру
              option(value="LEFT_SIDE_VIDEO") Видео слева
              option(value="RIGHT_SIDE_VIDEO") Видео справа
          button.button.button_green(:disabled="disBtn") Изменить
          <button type="button" class="button button_red table__profile" @click.prevent="blockRemove(item.id)">
            span.icon.is-small
              i.mdi.mdi-trash-can
          </button>
</template>

<script>
import axios from "axios";
import { URL } from "@/helpers/constants";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import { mapMutations } from "vuex";
import config from "@/helpers/tinymce.config.js";
import Editor from "@tinymce/tinymce-vue";
import dragula from "dragula";

import { ppreview } from "@/helpers/index";
export default {
  components: {
    editor: Editor,
  },
  computed: {
    ...mapGetters(["getToken", "getElems"]),
  },
  data() {
    return {
      title: "Данные публикации",

      data: [],
      disBtn: false,

      insideCheck: false,

      config,
    };
  },
  methods: {
    ...mapActions(["setToken", "setUser", "setUsers"]),
    ...mapMutations([
      "sortElems",
      "addElems",
      "elemsDelete",
      "changeElem",
      "checkEl",
    ]),
    errorFun(error) {
      if (error.response.data.message === "Unauthorized") {
        this.setToken(null);

        this.$router.push("/login");
      }
      alert(error.response.data.message);
    },

    prev(e, qsClass, imgClass) {
      ppreview(e, qsClass, imgClass);
    },

    blockRemove(id) {
      axios({
        method: "DELETE",
        url: `${URL}/api/admin/block/${id}`,
        data: {
          id: id,
        },
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
        .then(() => {
          this.elemsDelete(id);
          this.sortable();
        })
        .catch((error) => {
          this.errorFun(error);
        });
    },

    blockDelete(id) {
      this.elemsDelete(id);
      if (this.getBlcoks.length) {
        this.sortable();
      }
    },

    editBlock(id, pos) {
      this.disBtn = true;
      const form = document.querySelectorAll("#preview");
      const formData = new FormData(form[pos]);
      if (this.getElems[pos].text) {
        var json_arr = String(this.getElems[pos].text);
        formData.append("text", json_arr);
      }
      axios({
        method: "PATCH",
        url: `${URL}/api/admin/block/${id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${this.getToken}`,
        },
      })
        .then((data) => {
          let payload = {
            data: data.data,
            pos: pos,
          };
          this.changeElem(payload);
        })
        .catch((error) => {
          this.errorFun(error);
        })
        .finally(() => {
          this.disBtn = false;
        });
    },

    hideBlock(i) {
      const preview = document.querySelectorAll("#preview");
      if (preview[i].classList.contains("hide")) {
        preview[i].classList.remove("hide");
      } else {
        preview[i].classList.add("hide");
      }
    },

    sortable() {
      const itemRows = Array.from(document.querySelectorAll(".itemRow"));
      this.sortElems(itemRows);
    },
  },
  mounted() {
    var self = this;
    var drake = dragula([document.querySelector(".dragula")]);
    drake.on("dragend", function () {
      self.sortable();
    });
  },
};
</script>
