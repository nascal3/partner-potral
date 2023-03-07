import Base from '@/libs/core/Base'
import Form from '@/libs/core/Form'
import { fields } from './PaymentRepository'

export default class Payment extends Base {
  constructor () {
    super(fields)
    this.form = new Form(fields)
    this.group = auth.retrieve('partner')
  }

  store () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'operator_name',
          'payment_method',
          'user_account_no',
          'operator_id',
          'amount'
        ])
        let response = await this.form.submit('post', url(`partners/${this.group.id}/finances/payout/withdraw`), data)
        this.setFields(fields)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  show (paymentId) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("get", url(
            `partners/${this.group.id}/finances/withdrawals/${paymentId}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  generateOTP () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'email',
          'country_code',
        ])
        let response = await this.form.submit("post", url(
            `partners/${this.group.id}/finances/payout/otp/generate`
        ), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  validateOTP () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'email',
          'country_code',
          'code'
        ])
        let response = await this.form.submit("post", url(
            `partners/${this.group.id}/finances/payout/otp/validate`
        ), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  createPayoutAccount () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'operator_id',
          'operator_name',
          'user_account_no',
          'account_name',
          'user_id',
          'country_code'
        ])
        let response = await this.form.submit("post", url(
            `partners/${this.group.id}/finances/payout/account`
        ), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  editPayoutAccount (account_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = this.getFields([
          'user_account_no',
          'account_name',
          'operator_name'
        ])
        let response = await this.form.submit("put", url(
            `partners/${this.group.id}/finances/payout/account/${account_id}`
        ), data)
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  deletePayoutAccount (account_id) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("delete", url(
            `partners/${this.group.id}/finances/payout/account/${account_id}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }

  showPaymentMethods (countryCode) {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await this.form.submit("post", url(
            `partners/${this.group.id}/finances/payout/methods/${countryCode}`
        ))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}
