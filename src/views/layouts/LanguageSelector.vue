<template>
  <div class="d-flex justify-center align-center language">
    <span
        v-for="(language, index) in languageOptions"
        :key="index"
        :class="{ 'active': activeLanguage === language.code }"
        @click="changeLanguage(language.code)"
    >
      {{ language.name }}
    </span>
  </div>
</template>

<script>

export default {
  name: "LanguageSelector",
  data() {
    return {
      activeLanguage: 'en',
      languageOptions: [
        {
          code: "en",
          name: "English"
        },
        {
          code: "fr",
          name: "Français"
        },
      ],
    }
  },
  methods: {
    changeLanguage(languageCode) {
      localStorage.setItem('setLanguage', languageCode)
      this.$nextTick(() => {
        this.$i18n.locale = languageCode
        this.activeLanguage = languageCode

      })
    }
  },
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
