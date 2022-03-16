<template lang="pug">
  Create(:info='info')
</template>

<script>
import Create from "@/components/Create.vue";

export default {
  data() {
    return {
      info: {
        title: 'Создать на главной',
        url: 'article'
      }
    }
  },
  components: {
    Create
  }
};
</script>
