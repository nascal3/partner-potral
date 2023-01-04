<template>
  <div>
    <v-card class="ma-0 pa-0" flat>
      <v-card-title>
        <div>
          <h1 class="title font-weight-bold">
            {{ $t("orders.page_title") }}
          </h1>
        </div>
        <v-spacer></v-spacer>

        <div class="search-tenant-table">
          <v-text-field
              v-model="search"
              :label="$t('orders.search')"
              clearable
              dense
              hide-details
              outlined
              prepend-inner-icon="mdi-magnify"
              single-line
              @change="setSegmentEvent('Searched an order phrase')"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-dialog v-for="(document,index) in notificationDocuments" v-if="document.length > 0" :key="index"
                max-width="600" transition="dialog-top-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-card
              class="d-flex justify-space-between align-center px-8 py-2 mt-3"
              max-width="500">
            <div class="d-flex align-center">
              <v-icon color="error" x-large>mdi-alert-circle</v-icon>
              <v-card-text>
                <p class="body-2 font-weight-bold pa-0 ma-0 pt-4">
                  {{ index === "expired" ? $t('orders.expiring_document') : $t('orders.new_document_required') }}</p>
                <p>{{ index === "expired" ? $t('orders.upload', { expiry: topExpiryDate }) : $t('orders.last_day', { deadline: topPendingDate }) }}</p>
              </v-card-text>
            </div>
            <v-btn color="error" v-bind="attrs" v-on="on">
              {{ $t('orders.more_details') }}
            </v-btn>
          </v-card>
        </template>
        <template v-slot:default="dialog">
          <v-card class="pa-8" width="800">
            <div class="d-flex align-center">
              <v-icon class="pr-4" color="error" x-large>mdi-alert-circle</v-icon>
              <v-card-title class="text-h6 pa-0 font-weight-bold">{{
                  index === "expired" ? $t('orders.expiring_document') : $t('orders.new_document_required')
                }}
              </v-card-title>
            </div>
            <v-card-text>
              <p class="body-1 black--text pt-4">{{ partnerName }}</p>
              <p v-if="index === 'expired'" class="body-1 black--text">
                {{ $t('orders.expire_message') }}
              </p>
              <div v-else>
                <p class="body-1 font-weight-medium black--text">
                  {{ $t('orders.explanation_message') }}
                </p>
                <p class="body-2 black--text">{{ $t('orders.reason_message') }}</p>
              </div>
              <div v-for="(doc,index) in document" class="d-flex align-center py-2">
                <v-icon class="pr-5" color="success"
                >mdi-check-circle-outline
                </v-icon>
                <div class="pb-2">
                  <p class="body-2 black--text ma-0">{{ doc.name }}</p>
                  <p class="body-2 black--text ma-0">{{ $t('orders.expiry:', { date: doc.date }) }}</p>
                </div>
              </div>
              <p class="body-1 black--text">
                {{ $t('orders.please') }} {{ index === "expired" ? $t('orders.renew_them') : "" }} {{ $t('orders.submit_before') }}
                {{ index === "expired" ? topExpiryDate : topPendingDate }} {{ $t('orders.otherwise') }}
              </p>
            </v-card-text>
            <v-card-actions class="justify-end d-flex flex-column">
              <v-btn
                  class="body-2 px-14 py-5 my-4 text-capitalize"
                  text
                  @click="dialog.value = false"
              >
                {{ $t('orders.remind_me_later') }}
              </v-btn>
              <v-btn
                  class="body-2 px-14 py-5 text-capitalize"
                  color="primary"
                  large
                  @click="redirectToUpload"
              >
                {{ $t('orders.upload_document') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

      <v-row class="mt-5 mb-1">
        <v-col cols="12" md="6">
          <v-row class="date-filters">
            <v-col cols="12" md="7">
              <date-range @getDateRange="setDateRange"/>
            </v-col>
            <v-col cols="12" md="5">
              <v-select
                  v-model="selectedDrivers"
                  :items="driversData"
                  :label="$t('orders.filter_by_driver')"
                  dense
                  item-text="name"
                  item-value="id"
                  multiple
                  outlined
                  @change="getSelectedDrivers">
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>
                    <span>{{ item.name }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
										+{{ selectedDrivers.length - 1 }}
										{{ $t("orders.other_drivers") }}
									</span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <orders-summary :currency="currency" :orders="orders"/>

      <v-card-text class="px-0">
        <v-tabs id="orders-tabs" v-model="tab" color="#324BA8" left>
          <v-tab>{{ $t("orders.orders_tab") }}</v-tab>
          <v-tab>{{ $t("orders.errand_tab") }}</v-tab>

          <!--      #####orders summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <v-data-table
                  id="orders-table"
                  :expanded.sync="expanded"
                  :headers="headers"
                  :items="orders"
                  :loading="loading"
                  :loading-text="$t('core.system_loading')"
                  :no-data-text="$t('orders.no_orders_found')"
                  :no-results-text="$t('orders.no_results_found')"
                  :search="search"
                  class="title"
                  disable-pagination
                  disable-sort
                  fixed-header
                  hide-default-footer
                  item-key="order_no"
                  show-expand
                  @item-expanded="getOrderDetails">
                <template v-slot:item.destinations="{ item }">
                  {{ getLastStop(item.destinations) }}
                </template>
                <template v-slot:item.updated_at="{ item }">
                  {{ ordersDateFormat(item.updated_at) }}
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip
                      :color="setChipColor(item.status)"
                      :text-color="setChipTextColor(item.status)"
                      light
                      small>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length">
                    <order-details
                        :order-details="orderDetails"
                        :order-details-error="orderDetailsError"/>
                  </td>
                </template>
              </v-data-table>

              <app-pagination
                  v-if="orders.length"
                  id="orders-pagination"
                  :meta="meta"
                  @pageChanged="pageChanged"/>
            </v-container>
          </v-tab-item>

          <!--      #####Errands summary tab#####-->
          <v-tab-item>
            <v-container fluid>
              <errands-table
                  :errands="errands"
                  :loading="loadingErrands"
                  :search-phrase="search"/>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import segmentMixin from "@/mixins/segmentEvents";
import formatNumbers from "@/mixins/formatNumbers";
import Order from "@/libs/app/orders/Order";
import OrderDetails from "@/libs/app/order_details/OrderDetails";
import User from "@/libs/app/users/User";
import dateFormat from "@/mixins/dateFormat";
import {mapActions, mapGetters} from "vuex";
import LegalDocument from "@/libs/app/legal_documents/LegalDocument";

export default {
  mixins: [segmentMixin, dateFormat, formatNumbers],

  components: {
    "order-details": () => import("./partials/OrderDetails"),
    "date-range": () => import("@/components/core/DateRange.vue"),
    "orders-summary": () => import("./partials/OrdersSummary"),
    "errands-table": () => import("./partials/Errands"),
  },

  data() {
    return {
      expiry: false,
      notificationDocuments: {
        pending: [],
        expired: []
      },
      partnerName: auth.retrieve('partner').business_name,
      topExpiryDate: '',
      topPendingDate: '',
      tab: null,
      loading: true,
      loadingErrands: true,
      expanded: [],
      orderObj: new Order(),
      orderDetailsObj: new OrderDetails(),
      LegalDocumentObj: new LegalDocument(),
      usersObj: new User(),
      orders: [],
      orderDetails: {},
      orderDetailsError: {},
      chipColor: "error",
      chipTextColor: "#FFFFFF",
      menu: false,
      menu2: false,
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
      minimumDate: "",
      maximumDate: "",
      locale: localStorage.getItem("setLanguage"),
      page: 1,
      search: "",
      driversData: [],
      selectedDrivers: [],
      headers: [
        {text: this.$t("orders.table_order_num"), value: "order_no"},
        {
          text: this.$t("orders.table_pickup_location"),
          value: "pickup_location",
        },
        {text: this.$t("orders.table_destination"), value: "destinations"},
        {text: this.$t("orders.table_distance"), value: "distance"},
        {text: this.$t("orders.table_pickup_date"), value: "updated_at"},
        {text: this.$t("orders.table_status"), value: "status"},
        {text: "", value: "data-table-expand"},
      ],
      meta: {
        current_page: 1,
        first_page: 1,
        first_page_url: "/?page=1",
        last_page: 1,
        last_page_url: "/?page=1",
        next_page_url: null,
        per_page: 30,
        previous_page_url: null,
        total: 0,
      },
    };
  },

  computed: {
    ...mapGetters({
      errands: "getErrands",
    }),

    currency() {
      const {currency} = auth.retrieve("country");
      return currency;
    },
  },

  watch: {
    dateFrom(newDate) {
      this.minimumDate = newDate;
    },

    dateTo(newDate) {
      this.maximumDate = newDate;
    },

    tab(newTab) {
      if (newTab === 1) this.loadErrands();
    },
  },

  methods: {
    ...mapActions(["setErrands"]),
    redirectToUpload() {
      this.$router.push('/legal-documents')
    },
    getExpiringDocuments() {
      this.LegalDocumentObj.fetchAll().then(res => {
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        for (const obj of res.data) {
          if (obj.expires_at < oneMonthFromNow) {
            if (obj.expires_at !== null) {
              this.notificationDocuments.expired.push({
                name: obj.document.label,
                date: this.documentsDateFormat(obj.expires_at)
              })
              this.topExpiryDate = this.notificationDocuments.expired[0].date
            }
          }
        }
        this.getPendingDocuments()
      })
    },
    getPendingDocuments() {
      let pendingDocuments = []
      this.LegalDocumentObj.fetchAll().then(res => {
        for (const obj of res.data) {
          if (obj.status === "pending") {
            const date = new Date(obj.created_at) // specific date
            this.notificationDocuments.pending.push({
              name: obj.document.label,
              date: this.documentsDateFormat( new Date(date.setMonth(date.getMonth() + 1)) )// add one month
            })
            this.topPendingDate = this.notificationDocuments.pending[0].date
          }
        }
      })
    },
    setDateRange({dateFrom, dateTo}) {
      this.setSegmentEvent("Filter Order/Errand Date");
      this.dateFrom = dateFrom;
      this.dateTo = dateTo;
      this.tab === 1 ? this.loadErrands() : this.loadOrders();
    },

    getOrderDetails({item, value}) {
      if (!value) return;
      this.setSegmentEvent("Expand Order");
      const {order_no} = item;
      this.orderDetailsObj
          .show(order_no)
          .then((data) => {
            this.orderDetails = data.data;
          })
          .catch((error) => {
            this.orderDetailsError = error;
            throw error.data;
          });
    },

    getSelectedDrivers() {
      this.setSegmentEvent("Filter Order/Errands Driver");
      if (!this.selectedDrivers.length) return;
      if (this.tab === 0) return this.loadOrders();
      return this.loadErrands();
    },

    filterOutDriverIds(driversData) {
      return driversData.map((driver) => {
        if (!driver.id) return driver;
        return driver.id;
      });
    },

    formatDriverIds(driverIds) {
      const IdsText = driverIds.toString();
      return IdsText.replaceAll(",", "|");
    },

    getDriverIds() {
      return this.usersObj
          .show("?roles=driver")
          .then((data) => {
            if (this.selectedDrivers.length) {
              if (typeof this.selectedDrivers === "object") {
                const driversIdsArray = this.filterOutDriverIds(
                    this.selectedDrivers
                );
                return this.formatDriverIds(driversIdsArray);
              }
              return this.formatDriverIds(this.selectedDrivers);
            }
            this.driversData = data.data;
            this.selectedDrivers = data.data;
            const driversIdsArray = this.filterOutDriverIds(this.selectedDrivers);
            return this.formatDriverIds(driversIdsArray);
          })
          .catch((error) => {
            this.loading = false;
            flash({
              message: error.data.message,
              color: "#e74c3c",
            });
          });
    },

    getLastStop(destinations) {
      if (!destinations.length) return;
      return destinations[destinations.length - 1];
    },

    setChipColor(orderStatus) {
      const colorMap = {
        pending: "#FBDECF",
        failed: "#FBDECF",
        confirmed: "#CCEFFF",
        delivered: "#DEFAD2",
        "in transit": "#FDDB97",
        transit: "#FDDB97",
      };
      return colorMap[orderStatus];
    },

    setChipTextColor(orderStatus) {
      const colorMap = {
        pending: "#9B101C",
        failed: "#9B101C",
        confirmed: "#006492",
        delivered: "#116F28",
        "in transit": "#9D5004",
        transit: "#9D5004",
      };
      return colorMap[orderStatus];
    },

    pageChanged(page) {
      this.page = page;
      this.loadOrders();
    },

    formatOrders(ordersData) {
      if (!ordersData.length) return [];
      let allOrders = [];
      ordersData.forEach((order) => {
        allOrders = [...allOrders, ...order.transporter_orders];
      });

      return allOrders.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
    },

    loadOrders() {
      this.loading = true;
      this.getDriverIds()
          .then((driverIds) => {
            this.orderObj
                .show(this.dateFrom, this.dateTo, this.page, driverIds)
                .then(({data}) => {
                  this.orders = this.formatOrders(data);
                  this.meta.total = this.orders.length;
                  this.loading = false;
                })
                .catch((error) => {
                  this.loading = false;
                  flash({
                    message: error.data.message,
                    color: "#e74c3c",
                  });
                  throw error;
                });
          })
          .catch((error) => {
            this.loading = false;
            flash({
              message: error.data.message,
              color: "#e74c3c",
            });
            throw error;
          });
    },

    loadErrands() {
      this.loadingErrands = true;
      const {id} = auth.retrieve("partner");
      this.getDriverIds()
          .then((driverIds) => {
            this.setErrands({
              routes: {
                partner: id,
              },
              params: {
                startDate: this.dateFrom,
                endDate: this.dateTo,
                drivers: driverIds,
              },
            })
                .then(() => {
                  this.loadingErrands = false;
                })
                .catch((error) => {
                  this.loadingErrands = false;
                  flash({
                    message: error.response.data.message,
                    color: "#e74c3c",
                  });
                });
          })
          .catch((error) => {
            this.loadingErrands = false;
            flash({
              message: error.data.message,
              color: "#e74c3c",
            });
            throw error;
          });
    },
  },

  mounted() {
    this.setSegmentEvent("Visited orders page");
    this.loadOrders();
    this.getExpiringDocuments();
  },
};
</script>

<style lang="scss">
#orders-tabs {
  .v-tabs-slider-wrapper {
    .v-tabs-slider {
      background-color: transparent;
    }
  }

  .v-tab.v-tab {
    color: #909399;
    height: 38px;

    &--active {
      color: inherit;
    }
  }

  .v-item-group {
    margin-bottom: 30px;
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

#orders-table {
  .v-data-table__wrapper {
    max-height: 90vh;
    overflow-x: hidden;
    overflow-y: auto;

    table {
      color: #909399;

      thead {
        tr {
          th:first-letter {
            text-transform: uppercase;
          }
        }
      }

      tbody {
        tr.v-data-table__expanded__content {
          background-color: #ffffff !important;
          box-shadow: none;
        }

        tr:nth-of-type(odd) {
          background-color: #f7f9fc;
        }

        tr {
          td.text-start:first-child {
            color: #606266;
            font-weight: 700;
          }
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

#orders-pagination {
  .v-pagination {
    justify-content: flex-end;
    padding-right: 20px;

    .v-pagination__navigation {
      box-shadow: none;
    }

    .v-pagination__item--active {
      color: #324ba8;
      background-color: transparent !important;
    }

    .v-pagination__item {
      background: transparent;
      font-weight: 700;
      box-shadow: none;
    }
  }
}
</style>
<style lang="scss" scoped>
.v-tabs {
  //margin-top: 20px;
}

.v-tab {
  text-transform: none !important;
  font-weight: 700;

  &--active {
    background: #f0f3f7;
    border-radius: 6px;
  }
}

.search-tenant-table {
  width: 240px;
}
</style>
