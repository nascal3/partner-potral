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
        let response = await this.form.submit('post', url(`api/v1/partners/${this.group.id}/users`), data)
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  // update (userId) {
  //   const data = this.getFields();
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let response = await this.form.submit("patch", url(`api/v1/markets/${this.group}/users/${userId}`), data)
  //       resolve(response)
  //     } catch (err) {
  //       reject(err)
  //     }
  //   })
  // }
}

