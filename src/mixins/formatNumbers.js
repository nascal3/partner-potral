export default {
    methods: {
        thousandSeparator (value) {
            if (!value && (value !== 0)) return
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        formatAmountToNumber (value) {
            if (value) {
                value = value.replace(/\,/g, '')
                return parseFloat(value)
            }
            return 0
        }
    }
}
