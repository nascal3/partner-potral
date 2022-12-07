<template>
  <section>
    {{ errandDetails }}
  </section>
</template>

<script>
export default {
  name: "ErrandDetails",
  props: {
    errandDetails: {
      type: Array,
      default: () => []
    },
  },
}
</script>

<style scoped>

</style>
