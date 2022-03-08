import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './OrderDetailsRepository'

export default class OrderDetails extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  show (orderNumber) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(`partners/${this.group.id}/orders/${orderNumber}`))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

}

