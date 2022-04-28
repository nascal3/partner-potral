const timeCountDown = {
    data () {
        return {
            counter: 0
        }
    },
    methods: {
        timeCountDown(timeLeft) {
            const timer = setInterval(() => {
                if(timeLeft <= 0) {
                    clearInterval(timer)
                    this.counter = 0
                    this.removeCounterStorage()
                }
                timeLeft -= 1
                localStorage.setItem('otpExpiry', JSON.stringify(timeLeft))
                this.counter = timeLeft
            }, 1000)
        },

        removeCounterStorage() {
            localStorage.removeItem('otpExpiry')
        }
    },
};

export default timeCountDown
