<template>
  <section>
    <div><span>{{ $t('finance.order_amount') }}: </span>{{ details.currency}} {{ thousandSeparator(details.amount) }}</div>
    <div><span>{{ $t('finance.sendy_commission') }}: </span>{{ details.currency}} {{ thousandSeparator(details.commission) }}</div>
    <div><span>{{ $t('finance.your_earnings') }}: </span>{{ details.currency}} {{ thousandSeparator(details.earnings) }}</div>
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
