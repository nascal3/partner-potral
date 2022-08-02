<template>
  <section>
    <div><span>{{ $t('finance.payment_method') }}: </span>{{ thousandSeparator(details.amount) }}</div>
    <div><span>{{ $t('finance.funds_sent_to') }}:</span>{{ thousandSeparator(details.commission) }}</div>
  </section>

</template>

<script>
import formatNumbers from "@/mixins/formatNumbers"

export default {
  mixins: [ formatNumbers],

  props: {
    details: {
      type: Object,
      default: () => {}
    },
  }

}
</script>

<style lang="scss" scoped>
section {
  div:last-child{
    color: #606266;
    font-weight: 700;
  }
}
</style>
