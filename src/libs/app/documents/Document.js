import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './DocumentRepository'

export default class Document extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  show (country, resource, status, page) {
    return new Promise(async (resolve, reject) => {
      try {
        // let response = await this.form.submit("get", url(
        //     `partners/${this.group.id}/documents?country=${country}&resource=${resource}&status=${status}&page=${page}`
        // ))
        let response = []
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

