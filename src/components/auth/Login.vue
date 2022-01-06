<template>
  <v-container>
    <v-img 
      style="margin: 50px auto 0 auto"
      max-height="150"
      max-width="250"
      src="https://assets.website-files.com/5be92ce6e4a547dcc61b976c/60253f92874eabf1a8ecf88f_Logo_SendyMain_Colored_Normal_SVG.svg"
    ></v-img>

    <v-row
      class="text-center"
    >
      <v-col cols="12">
        <h1 class="display-1 font-weight-black">Partner Portal</h1>
      </v-col>
      <v-col cols="12">
        <h1 class="title mt-10">
          Insert an unbwogably awesome catchphrase here.
        </h1>
      </v-col>
      <v-col 
        offset-md="4"
        cols="12"
        md="4"
      >
        <v-text-field
          v-if="action == 'generate'"
          large
          outlined
          persistent-hint
          class="body-2"
          label="Email address"
          v-model="authObj.email"
          :hint="errors.get('email')"
          :error="errors.has('email')"
          @input="errors.clear('email')"
        >
          <template v-slot:append>
            <v-progress-circular
              v-if="loading"
              indeterminate
              :size="25"
              :width="2"
              class="mr-2"
              color="primary"
            ></v-progress-circular>

            <v-btn
              v-else
              icon
              class="mt-n2"
              color="primary"
              @click="generateCode()"
            >
              <v-icon>
                mdi-arrow-right-bold-circle
              </v-icon>
            </v-btn>
          </template>
        </v-text-field>

        <v-otp-input
          v-if="action == 'verify'"
          length="4"
          class="body-2"
          persistent-hint
          v-model="authObj.code"
          :hint="errors.get('code')"
          :error="errors.has('code')"
          @input="errors.clear('code')"
          @finish="verifyCode()"
        ></v-otp-input>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Auth from "@/libs/auth/Auth"

export default {
  data () {
    return {
      loading: false,
      action: 'generate',
      authObj: new Auth()
    }
  },

  computed: {
    errors () {
      return this.authObj.form.errors
    }
  },

  methods: {
    generateCode () {
      if (!this.loading) {
        this.loading = true
        this.authObj.generate()
          .then(() => {
            this.action = 'verify'
          })
          .finally(() => {
            this.loading = false
          })
      }
    },

    verifyCode () {
      this.authObj.verify()
        .then(({ data }) => {
          console.log(data.partners.length)
          if (data.partners.length == 1) {
            this.authObj.encrypt({
            ..._.omit(data, ['type']),
              partner: data.partners[0]
            })
            this.$router.push({ name: 'app-dashboard' })
          } else {
            this.authObj.encrypt({
              ..._.omit(data, ['type']),
            })
            this.$router.push({ name: 'accounts' })
          }
          // this.encrypt
          // console.log(data)
          // this.authObj.abilities()
          //   .then(response => {
          //     console.log(response)
          //     // /**
          //     //  * @todo - Check if user has permission to access the dashboard
          //     //  */
          //     // this.$router.push({ name: 'app-dashboard' })
          //   })

          // 

          
          // this.$router.push({ name: 'app-onboarding' })
        })
        .catch(({ data, status }) => {
          const codes = [400, 409, 500]
          if (codes.includes(status)) {
            flash({
              message: data.message,
              color: '#e74c3c',
            })
          }
        })
    },
  }
}
</script>