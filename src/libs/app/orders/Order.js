import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './OrderRepository'

export default class Order extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  show (from, to, page, driversIds) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(
            `partners/${this.group.id}/orders?from=${from}&to=${to}&drivers=${driversIds}&page=${page}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

