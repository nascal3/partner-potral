import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './LegalDocumentRepository'

export default class LegalDocument extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  show (documentSubmissionId) {
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
}

