import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './RoleRepository'

export default class Role extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.partner = auth.retrieve('partner')
  }

  store () {
    const data = this.getFields();
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit('post', url(`partners/${this.partner.id}/roles`), data)
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  show (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(`partners/${this.partner.id}/roles/${id}`));
        resolve(response)
      } catch (err) {
        reject(err)
      }
    });
  }

  update (roleId) {
    const data = this.getFields();
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("patch", url(`partners/${this.partner.id}/roles/${roleId}`), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

