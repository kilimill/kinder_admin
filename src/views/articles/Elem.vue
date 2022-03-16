<template lang="pug">
  Edit(:info='info')
</template>

<script>
import Edit from "@/components/Edit.vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      info: {
        title: 'Изменить публикацию на главной',
        url: 'article',
        id: this.id,
      }
    }
  },
  components: {
    Edit
  }
};
</script>
