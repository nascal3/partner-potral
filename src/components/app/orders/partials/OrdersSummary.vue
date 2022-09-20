<template>
  <section v-if="initialised" v-animate-css="animationObject">
    <v-row>
      <v-col cols="12" md="4">
        <div class="order-nums d-flex align-center justify-space-around">
          <div class="large-text">{{ thousandSeparator(orders.length) }}</div>
          <div class="grey-text">{{ $t('orders.total_num_orders') }}</div>
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="total-distance d-flex align-center justify-space-around">
          <div class="large-text d-flex align-center">
            {{ thousandSeparator(totalDistance) }} <span class="ml-2">KM</span>
          </div>
          <div class="grey-text">{{ $t('orders.total_distance') }}</div>
        </div>
      </v-col>
<!--      <v-col cols="12" md="4">-->
<!--        <div class="total-earnings d-flex align-center justify-space-around">-->
<!--          <div class="large-text d-flex align-center">-->
<!--            <span class="mr-2">{{ currency }}</span> {{ thousandSeparator(totalEarnings) }}</div>-->
<!--          <div class="grey-text">{{ $t('orders.total_earning') }}</div>-->
<!--        </div>-->
<!--      </v-col>-->
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
      totalDistance: 0,
      totalEarnings: 0,
      animationObject:{
        classes: 'fadeIn',
        delay: 0,
        duration: 300
      }
    }
  },

  computed: {
    initialised() {
      return this.orders.length;
    }
  },

  watch: {
    orders() {
      if (this.initialised) {
        this.calculateTotalEarnings()
        this.formatDistance()
      }
    }
  },

  methods: {
    calculateTotalEarnings() {
      let totalCost = 0
      this.orders.forEach(order => {
        totalCost += parseFloat(order.cost)
      })
      this.totalEarnings = totalCost
    },

    formatDistance() {
      const distanceArray = []
      this.orders.forEach(order => {
        // convert e.g  "7.43 km" string  to "7.43" number
        // then insert the number into an array
        const distanceValue = order.distance.split(' ')
        if (distanceValue[0] === 'nu') distanceArray.push(0)
        else distanceArray.push(parseFloat(distanceValue[0]))
      })
      this.calculateTotalDistance(distanceArray)
    },

    calculateTotalDistance(distanceArray) {
      const initialDistance = 0
      this.totalDistance = distanceArray.reduce((previousValue, currentValue) =>
        previousValue + currentValue, initialDistance
      )
      this.totalDistance = this.totalDistance.toFixed(2)
    },
  },
}
</script>

<style lang="scss" scoped>
  section {
    font-weight:700;

    .large-text {
      font-size: 34px;
      span {
        font-size: 16px;
      }
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
