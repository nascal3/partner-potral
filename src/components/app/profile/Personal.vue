<template>
  <div>
    <h2 class="subtitle-1 mb-4">
      {{ $t('users.personal_information') }}
    </h2>
    <personal-form :user-details="user" />
  </div>
</template>

<script>
export default {
  name: 'Personal',

  data() {
    return {
      user: this.$attrs.doe
    }
  },

  components: {
    'personal-form': () => import('./partials/PersonalForm.vue')
  },

  mounted () {
    return this.$emit('meta', {
      title: 'Personal Information',
      crumbs: {
        text: 'Personal info', disabled: true,
      }
    })
  }
}
</script>
