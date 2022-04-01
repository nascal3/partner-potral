import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './UserRepository'

export default class User extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  store () {
    const data = this.getFields();
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit('post', url(`partners/${this.group.id}/users`), data)
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  show (query = '') {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(`partners/${this.group.id}/users${query}`))
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
        let response = await this.form.submit('patch', url(`users/${userId}/users`), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

