<template>
  <v-menu offset-y
		min-width="300"
		class="px-4"
	>
		<template v-slot:activator="{ on }">
			<v-btn 
				icon
				small
				class="mx-0 px-3"
				v-on="on"
			>
				<v-icon small>mdi-apps</v-icon>
			</v-btn>
		</template>
		<v-list class="px-3">
			<v-item-group
				v-model="currentApp"
			>
				<v-row>
					<v-col
						v-for="(app, i) in apps"
						:key="i"
						cols="12"
						md="4"
					>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div 
                v-on="on"
                class="text-center"
                @click="switchToApp(app)"
              >
                <v-btn
                  icon
                  :color="app.color"
                  x-large
                >
                  <v-icon x-large>mdi-{{app.icon}}</v-icon>
                </v-btn>
                <div>
                   <p class="font-weight-bold caption d-inline-block text-truncate pa-0 ma-0"
								>
                {{ app.nickname }}</p>
                </div>
               
              </div>
            </template>
            <span>{{ app.name }}</span>
          </v-tooltip>
					</v-col>
				</v-row>
			</v-item-group>
		</v-list>
	</v-menu>
</template>

<script>
export default {
	data () {
		return {
			currentApp: null,
			apps: auth.retrieve('user').apps,
		}
	},

	methods: {
    switchToApp (app) {
      alert('Not implemented yet')
    }
	},
}
</script>
