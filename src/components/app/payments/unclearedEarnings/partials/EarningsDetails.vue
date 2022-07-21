<template>
  <section>
    <div><span>Order Amount: </span>{{ thousandSeparator(details.order_amount) }}</div>
    <div><span>Sendy Commission:</span>{{ thousandSeparator(details.commission) }}</div>
    <div><span>Your earnings: </span>{{ thousandSeparator(details.earnings) }}</div>
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
