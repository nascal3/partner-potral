const segmentMixin = {

    methods: {
        setSegmentEvent(eventName) {
            if (process.env.DOCKER_ENV !== 'production') return
            analytics.track(eventName, {
                event: eventName,
            });
        },
    },
};

export default segmentMixin;
