const timeCountDown = {
    methods: {
        timeCountDown(timeLeft) {
            const timer = setInterval(() => {
                if(timeLeft <= 0) {
                    clearInterval(timer)
                    localStorage.setItem('otpExpiry', JSON.stringify(0))
                    return 0
                }
                timeLeft -= 1
                localStorage.setItem('otpExpiry', JSON.stringify(timeLeft))
                return timeLeft
            }, 1000)
            return timer
        }
    },
};

export default timeCountDown
