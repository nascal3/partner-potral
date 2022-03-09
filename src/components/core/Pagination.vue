<template>
  <div 
    class="text-center pt-5"
    v-if="meta"
  >
    <v-pagination 
      circle
      v-model="currentPage" 
      :length="lastPage"
      :total-visible="totalVisible"
    ></v-pagination>
  </div>
</template>

<script>
export default {
  props: [
    "meta",
  ],

  data () {
    return {
      totalVisible: 7,
      lastPage: null,
      currentPage: null,
    }
  },

  watch: {
    meta () {
      this.metamorphosis()
    },

    currentPage (page, old) {
      if (old != null) {
        this.$emit('pageChanged', page)
      }
    }
  },

  methods: {
    metamorphosis () {
      this.currentPage = this.meta.current_page
      this.lastPage = this.meta.last_page
    }
  },

  mounted () {
    this.metamorphosis()
  }
}
</script>