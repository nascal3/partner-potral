import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './TransporterRepository'

export default class Transporter extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  store () {
    const data = {
      driver_id: `${this.driver_id}`, 
      vehicle_id: this.vehicle_id, 
    }
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("post", url(`partners/${this.group.id}/transporters`), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  show (transporterId) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit('get', url(`partners/${this.group.id}/transporters/${transporterId}`))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  destroy (transporterId) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit('delete', url(`partners/${this.group.id}/transporters/${transporterId}`))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}

