const segmentMixin = {

    methods: {
        setSegmentIdentity({user}) {
            if (process.env.DOCKER_ENV !== 'production') return
            const { id, email, name, phone } = user
            analytics.identify(id, {
                name,
                email,
                phone
            });
        },

        setSegmentEvent(eventName) {
            if (process.env.DOCKER_ENV !== 'production') return
            analytics.track(eventName, {
                event: eventName,
            });
        },
    },
};

export default segmentMixin;
