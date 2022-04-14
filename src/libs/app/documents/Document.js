import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './DocumentRepository'

export default class Document extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  show (dateFrom, dateTo, page, status) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(
            `partners/${this.group.id}/documents?from=${dateFrom}&to=${dateTo}&status=${status}&page=${page}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

