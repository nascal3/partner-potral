<template>
  <section>
    <v-row>
      <v-col cols="12" md="4">
        <div class="order-nums d-flex align-center justify-space-around">
          <div class="large-text">{{ thousandSeparator(orders.length) }}</div>
          <div class="grey-text">{{ $t('orders.total_num_orders') }}</div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="total-earnings d-flex align-center justify-space-around">
          <div class="large-text">{{ currency }} {{ thousandSeparator(32340) }}</div>
          <div class="grey-text">{{ $t('orders.total_earning') }}</div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="total-distance d-flex align-center justify-space-around">
          <div class="large-text">{{ thousandSeparator(680) }} KM</div>
          <div class="grey-text">{{ $t('orders.total_distance') }}</div>
        </div>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import formatNumbers from "@/mixins/formatNumbers"

export default {
  mixins: [formatNumbers],

  props: {
    currency: {
      type: String,
      default: () => ''
    },
    orders: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      key: value
    }
  },

  methods: {
    name() {

    }
  },
}
</script>

<style lang="scss" scoped>
section {
  font-weight:700;

  .large-text {
    font-size: 34px;
  }
  .grey-text {
    color: #606266;

  }
  .order-nums {
    color: #CC6100;
    background: #FFF5EB;
    border: 1px solid #E2E7ED;
    border-radius: 6px;
    min-height: 96px;
  }
  .total-earnings {
    color: #116F28;
    background: #F4FFEF;
    border: 1px solid #E2E7ED;
    border-radius: 6px;
    min-height: 96px;
  }
  .total-distance {
    color: #324BA8;
    background: #E9EDFF;
    border: 1px solid #E2E7ED;
    border-radius: 6px;
    min-height: 96px;
  }
}

</style>
