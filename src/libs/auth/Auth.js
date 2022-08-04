import Base from "@/libs/core/Base";
import Form from "@/libs/core/Form";
import { fields } from './AuthRepository'

export default class Auth extends Base {
  constructor () {
    super(fields);
    this.form = new Form(fields)
    this.app = process.env.VUE_APP_PORTAL
  }

  register () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'business_name', 'legal_entity_type', 'country_id', 'administrator', 'product_group', 'identification_method'
        ])
        const response = await this.form.submit('post', url('sign-up'), data)
        flash({
          message: 'Registration successful. Redirecting ...',
          color: 'green'
        })
        this.email = data.administrator.email
        this.phone = data.administrator.phone
        this.country_id = data.country_id
        this.identification_method = data.identification_method
        localStorage.setItem('sendy:contacts', JSON.stringify({
          country_id: this.country_id,
          phone: this.phone,
          email: this.email,
          identification_method: this.identification_method
        }))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  generate () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields(['email', 'phone', 'authenticator', 'product_group', 'identification_method', 'country_id'])
        const response = await this.form.submit('post', url('otp/generate'), data)
        const identifier = this.identifier.toLowerCase()
        localStorage.setItem('otpExpiry', JSON.stringify(response.data.otp_expiry_time))
        localStorage.setItem('sendy:identification', JSON.stringify({
          identifier,
          value: this[identifier]
        }))
        flash({...response, color: '#38c172'})
        resolve(response)
      } catch ({status, data}) {
        const codes = [404]
        const message = codes.includes(status) ? data.message : data.errors[0].message
        flash({
          message,
          color: '#e74c3c'
        })
        reject(data)
      }
    })
  }

  verify () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields(['email', 'phone', 'authenticator', 'code', 'product_group', 'identification_method', 'country_id'])
        const response = await this.form.submit('post', url('sign-in'), data)
        this.encrypt(response.data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  abilities () {
    return new Promise(async (resolve, reject) => {
      try {
        const acl = auth.retrieve('acl')
        const partner = auth.retrieve('partner')

        //Fetch and cache the users abilities data
        this.encrypt({
          ...this.decrypt(),
          abilities: acl.abilities
        })

        //Fetch and cache the country data
        const { data } = await this.form.submit('get', url(`countries/${partner.country_id}`))
        this.encrypt({
          ...this.decrypt(),
          country: data,
        })

        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  logout () {
    /** @todo - add call to API to expire the token */
    localStorage.removeItem(this.app)
    localStorage.clear()
    flash({
      message: 'You have been logged out successfully',
      color: '#38c172'
    })
  }
}
