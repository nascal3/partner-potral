<template>
  <div class="px-0">
    <v-data-table
        id="notifications-table"
        fixed-header
        disable-sort
        class="title"
        hide-default-footer
        disable-pagination
        :no-data-text="$t('notifications.no_notifications_found')"
        :no-results-text="$t('notifications.no_results_found')"
        :headers="headers"
        :items="notifications"
        item-key="id"
        :expanded.sync="expanded"
        show-expand
        @item-expanded="showNotification"
        :loading="loading"
        :loading-text="$t('core.system_loading')"
    >
      <template v-slot:item.status="{ item }">
        <v-chip :color="setColor(item.status)" outlined small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.date="{ item }">
        {{ notificationsDateFormat(item.date) }}
      </template>
      <template v-slot:item.message="{ item }">
        <div v-html="item.message"></div>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
            dark
            small
            color="primary"
            class="ttn body-2"
            :to="`legal-documents/${item.id}`"
            @click="setSegmentEvent('Select View document')"
        >
          {{ $t('documents.view_document') }}
        </v-btn>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div v-html="item.message"></div>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import mockResponse from '@/libs/app/notifications/mockResponce.json'
import segmentMixin from "@/mixins/segmentEvents"
import dateFormat from "@/mixins/dateFormat"

export default {
  mixins: [segmentMixin, dateFormat],

  data () {
    return {
      loading: true,
      expanded: [],
      notifications: [],
      headers: [
        { text: this.$t('notifications.notification_status'), value: 'status' },
        { text: this.$t('notifications.notification_date'), value: 'date' },
        { text: this.$t('notifications.notification_title'), value: 'title' },
        { text: this.$t('notifications.notification_message'), value: 'message' },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },

  methods: {
    setColor(status) {
      if (status === 'unread') return 'error'
      return 'success'
    },

    showNotification({item, value}) {
      if (!value) return
      this.setSegmentEvent('Read notification')
      // TODO mark notification as read using the id
      const { id } = item

    },

    loadNotifications () {
      this.notifications = mockResponse
      this.loading = false
    },
  },

  mounted() {
    this.loadNotifications()
  }

}
</script>

<style lang="scss">
#notifications-table {
  .v-data-table__wrapper {
    max-height: 90vh;
    overflow-x: hidden;
    overflow-y: auto;

    table {
      thead {
        tr {
          th:first-letter {
            text-transform: uppercase;
          }
        }
      }
      tbody {
        tr:nth-of-type(odd) {
          //background-color: #F7F9FC;
        }
      }
    }
  }
  .v-chip {
    .v-chip__content {
      padding-top: 2px;
      display: inline-block !important;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>
