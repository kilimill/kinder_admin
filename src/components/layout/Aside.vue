<template lang="pug">
  aside.aside
    p.aside__title
      b Admin 

    menu.aside__menu-container
      p.aside__menu-label Главная
      ul.aside__menu-list
        li
          <router-link to="/" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-desktop-mac.default
            | Главная Админка 
          </router-link>
        </li>
      </ul>

      p.aside__menu-label Календарь
      ul.aside__menu-list
        li
          <router-link to="/post" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-format-list-bulleted.default
            | Список
          </router-link>
        li
          <router-link to="/makingPost" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-typewriter.default
            | Создать в календаре
          </router-link>

      p.aside__menu-label Главная Страница
      ul.aside__menu-list
        li
          <router-link to="/article" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-format-list-bulleted.default
            | Список
          </router-link>
        li
          <router-link to="/makingArticle" class="aside__menu-link aside__menu-link_icon">
            span.icon
              i.mdi.mdi-typewriter.default
            | Создать на главной
          </router-link>

    menu.aside__menu.aside__menu_bottom
      ul.aside__menu-list
        li
          a.aside__menu-link.aside__menu-link_icon.aside__menu-link_logout(href="/logout" @click.prevent="logoutUser")
            span.icon
              i.mdi.mdi-logout.default
            | Выйти
          </router-link>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions([
      'setToken',
    ]),
    logoutUser() {
      this.setToken(null);
      this.$router.push('/login');
    }
  },
}
</script>
