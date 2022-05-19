import { format } from "date-fns";

const dateFormat = {
    methods: {
        ordersDateFormat(date) {
            if (!date) return
            return format(new Date(date), 'iii, do LLL')
        },

        notificationsDateFormat(date) {
            if (!date) return
            return format(new Date(date), 'd MMM yyy, HH:mm')
        },
    },
};

export default dateFormat;
