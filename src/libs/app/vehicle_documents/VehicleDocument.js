import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './VehicleDocumentRepository'

export default class VehicleDocument extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  update (vehicleDocumentId) {
    const data = this.getFields(['value', 'expires_at'])
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("patch", url(`partners/${this.group.id}/vehicle-documents/${vehicleDocumentId}`), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

