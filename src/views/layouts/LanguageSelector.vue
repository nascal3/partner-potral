<template>
  <div class="d-flex justify-center align-center language">
    <span
        v-for="(language, index) in languages.data"
        :key="index"
        :class="{ 'active': activeLanguage === language.code }"
        @click="changeLanguage(language.code)"
    >
      {{ language.name }}
    </span>
  </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
  name: "LanguageSelector",
  data() {
    return {
      activeLanguage: localStorage.getItem('setLanguage') || 'en',
    }
  },

  computed: {
    ...mapGetters({
      languages: 'getLanguages'
    }),
  },

  methods: {
    ...mapActions([
      'setLanguages'
    ]),

    changeLanguage(languageCode) {
      localStorage.setItem('setLanguage', languageCode)
      this.$nextTick(() => {
        this.$i18n.locale = languageCode
        this.activeLanguage = languageCode

      })
    }
  },

  mounted () {
    this.setLanguages()
  }
}
</script>

<style scoped>

.language span {
  font-size: 12px;
  cursor: pointer;
  margin-right: 15px;
  color: #9E9E9E;
}
.active {
  color: #5045B0 !important;
}
</style>
