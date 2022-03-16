<template lang="pug">
  List(:info='info')
</template>

<script>
import List from "@/components/List.vue";

export default {
  data() {
    return {
      info: {
        title: 'Публикации в календаре',
        url: 'post',
      }
    }
  },
  components: {
    List
  }
};
</script>
