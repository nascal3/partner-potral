import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './VehicleDocumentRepository'
import { format, add } from 'date-fns'

export default class VehicleDocument extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  update (vehicleDocumentId) {
    const { value } = this.getFields(['value'])
    const result = add(new Date(),{days: 7})
    const data = {
      value,
      expires_at: format(result, 'yyyy-MM-dd')
    }
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.form.submit("patch", url(`partners/${this.group.id}/document-submissions/${vehicleDocumentId}`), data)
        resolve(response)
      } catch (err) {
        flash({
          message: err.message,
          color: '#e74c3c'
        })
        reject(err)
      }
    })
  }

  upload () {
    return new Promise(async (resolve, reject) => {
      try {
        let formData = new FormData()
        formData.append('file_upload', this.file_upload)
        formData.append('upload_type', `${this.resource}_document`)
        formData.append('vehicle_document_id', parseInt(this.vehicle_document_id))
        formData.append('document_submission_id', parseInt(this.document_id))
        const response = await this.form.submit('post', url(`partners/${this.group.id}/uploads`), formData, {
          'Content-Type': 'multipart/form-data'
        })
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        flash({
          message: err.message,
          color: '#e74c3c'
        })
        reject(err)
      }
    })
  }
}

