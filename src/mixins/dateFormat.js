import { format } from "date-fns";
import { en, fr, ar } from 'date-fns/locale'

const locales = { en, fr, ar }
const setLanguage = localStorage.getItem('setLanguage')

const dateFormat = {
    methods: {
        ordersDateFormat(date) {
            // format date result e.g Mon, 20th Sep 2021
            if (!date) return
            return format(new Date(date), 'iii, do LLL yyy', {
                locale: locales[setLanguage]
            })
        },

        notificationsDateFormat(date) {
            // format date result e.g 20 Sep 2021, 01:12 pm
            if (!date) return
            return format(new Date(date), 'd MMM yyy, hh:mm aaa', {
                locale: locales[setLanguage]
            })
        },

        withdrawalDateFormat(date, separator) {
            // format date result to e.g Saturday from 8am
            if (!date) return '...'
            const day = format(new Date(date), 'iiii', {
                locale: locales[setLanguage]
            })
            const time = format(new Date(date), 'h aaa', {
                locale: locales[setLanguage]
            })
            return `${day} ${separator} 11am`
        },
    },
};

export default dateFormat;
