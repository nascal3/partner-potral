import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './LegalDocumentRepository'

export default class LegalDocument extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  show (documentSubmissionId, filePath) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(
            `partners/${this.group.id}/uploads?document_submission_id=${documentSubmissionId}&file_path=${filePath}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  fetch (documentSubmissionId) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(
            `partners/${this.group.id}/document-submissions/${documentSubmissionId}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  sign () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields(['identification_number', 'contract_id', 'signed_at', 'viewed_at'])
        const response = await this.form.submit('post', url(`partners/${this.group.id}/contract-signatures`), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

