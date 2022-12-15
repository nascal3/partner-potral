<template>
  <section v-animate-css="animationObject">
    <v-card-text class="pt-6 pl-0 pr-0 pb-0">
      <div class="message-container pa-4">
        <div class="message-container__text">
          <v-icon color="#116F28">mdi-check-circle</v-icon>
          {{ $t('auth.successfully_signed') }}
        </div>

        <div class="message-container__subtext mt-5">
          {{ $t('auth.successfully_signed_message') }}
        </div>
      </div>

      <div class="d-flex justify-end mt-6">
        <v-btn
            large
            color="primary"
            class="font-weight-bold"
            @click="redirect"
        >
          {{ $t('auth.ok_go') }}
        </v-btn>
      </div>
    </v-card-text>
  </section>
</template>

<script>
export default {

  data() {
    return {
      animationObject: {
        classes: 'slideInRight',
        delay: 0,
        duration: 300
      }
    }
  },

  methods: {
    redirect() {
      this.$emit('closeDialog', true)
      this.$router.push({name: 'partner-contract.index'})
    }
  }
}
</script>

<style lang="scss" scoped>
.v-card__text {
  .message-container {
    border: 1px solid #116F28;
    border-radius: 8px;

    &__text {
      .v-icon {
        font-size: 30px;
      }
      font-weight: 700;
      font-size: 20px;
    }

    &__subtext {
      font-weight: 400;
      font-size: 16px;
      color: #909399;
      text-align: center;
    }
  }
  .v-btn {
    text-transform: capitalize;
  }
}
</style>
