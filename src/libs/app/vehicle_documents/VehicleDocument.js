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
        formData.append('upload_type', 'vehicle_document')
        formData.append('vehicle_document_id', parseInt(this.vehicle_document_id))
        const response = await this.form.submit('post', url(`partners/${this.group.id}/uploads`), formData, {
          'Content-Type': 'multipart/form-data'
        })
        this.setFields(fields)
        flash({...response, color: '#38c172'})
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

