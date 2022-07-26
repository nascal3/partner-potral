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
          'vendor_type_id',
          'registration_number',
        ])
        let response = await this.form.submit('post', url(`banks/${this.group.id}`), data)
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }


  update (userId) {
    const data = this.getFields();
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("patch", url(`banks/${this.group.id}/users/${userId}`), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

