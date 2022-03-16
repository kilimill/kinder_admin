<template lang="pug">
  Create(:info='info')
</template>

<script>
import Create from "@/components/Create.vue";

export default {
  data() {
    return {
      info: {
        title: 'Создать в календаре',
        url: 'post'
      }
    }
  },
  components: {
    Create
  }
};
</script>
