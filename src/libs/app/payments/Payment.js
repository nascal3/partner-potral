import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './PaymentRepository'

export default class Payment extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  store () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'paybill',
          'payment_reference',
          'amount',
          'payment_method',
        ])
        let response = await this.form.submit('post', url(`partners/${this.group.id}/finances/withdraw`), data)
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

