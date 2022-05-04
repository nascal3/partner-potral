const timeCountDown = {
    data () {
        return {
            counter: 0,
            timer: null
        }
    },
    methods: {
        timeCountDown(timeLeft) {
            this.timer = setInterval(() => {
                if(timeLeft <= 0) {
                    this.counter = 0
                    return this.removeCounterStorage()
                }
                timeLeft -= 1
                localStorage.setItem('otpExpiry', JSON.stringify(timeLeft))
                this.counter = timeLeft
            }, 1000)
        },

        removeCounterStorage() {
            clearInterval(this.timer)
            localStorage.removeItem('otpExpiry')
        }
    },
};

export default timeCountDown
