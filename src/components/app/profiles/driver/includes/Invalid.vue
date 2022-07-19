<template>
  <div class="d-flex align-center justify-center" style="height: 60vh;">
    <v-card flat>
      <v-card-text class="text-center headline">
        <p class="font-weight-bold">{{ $t('driver.not_active') }}</p>
        <p class="body-1">
          {{ $t('driver.not_active_message') }}
        </p>
        <p class="body-1 mt-4 text-center">
          <router-link
            class="deep-orange--text"
            to="/dashboard"
          >
            {{ $t('core.to_dashboard') }}
          </router-link>
        </p>
      </v-card-text>
    </v-card>
    
  </div>
</template>

<script>
export default {
  mounted () {
    this.$emit('meta', {
      title: 'Invalid Driver',
      crumbs: [{
        text: 'Unavailable', disabled: true,
      }]
    })
  }
}
</script>