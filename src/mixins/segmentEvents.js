const segmentMixin = {
    computed: {
        userIdentity() {
            return  auth.retrieve('user')
        }
    },

    methods: {
        setSegmentIdentity({user}) {
            // if (process.env.DOCKER_ENV === 'development') return
            const { id, email, name, phone } = user
            analytics.identify(id, {
                name,
                email,
                phone
            })
        },

        setSegmentEvent(eventName, additionalProps = {}) {
            // if (process.env.DOCKER_ENV === 'development') return
            analytics.track(eventName, {
                event: eventName
            });

            if (!this.userIdentity) return
            const { id, email, name, phone } = this.userIdentity
            const payload = {
                distinct_id: id,
                event: eventName,
                name,
                email,
                phone,
                ...additionalProps
            }
            mixpanel.track(eventName, payload)
        },
    },
};

export default segmentMixin;
