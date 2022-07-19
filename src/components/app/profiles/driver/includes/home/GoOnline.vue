<template>
  <v-bottom-sheet
    v-model="sheet"
    persistent
  >
    <v-sheet
      height="190px"
    >
      <v-card flat>
        <v-card-title class="font-weight-bold">
          {{ $t('driver.offline_title') }}
        </v-card-title>

         <v-card-subtitle>
          {{ $t('driver.offline_subtitle') }}
         </v-card-subtitle>

         <v-card-actions class="px-4">
           <v-btn
            dark
            block
            x-large
            class="ttn font-weight-bold body-2"
            color="primary"
            @click="setSegmentEvent('Go online button clicked')"
           >
            {{ $t('driver.online_call_to_action') }}

            <v-icon

              v-for="i in 3"
              :key="`icon-${i}`"
              small
              :class="i === 1 ? 'ml-3' : ''"
            >
              mdi-menu-right
            </v-icon>
           </v-btn>
         </v-card-actions>
      </v-card>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents"

export default {
  mixins: [segmentMixin],

  data () {
    return {
      sheet: true
    }
  },

  computed: {
    broadcaster () {
      return this.process.env.VUE_APP_BROADCASTER
    }
  }
}
</script>
