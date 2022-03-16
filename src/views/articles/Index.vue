<template lang="pug">
  List(:info='info')
</template>

<script>
import List from "@/components/List.vue";

export default {
  data() {
    return {
      info: {
        title: 'Публикации на главной',
        url: 'article',
      }
    }
  },
  components: {
    List
  }
};
</script>
