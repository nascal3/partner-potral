import Base from "@/libs/core/Base";
import Form from "@/libs/core/Form";

export default class Driver extends Base {
  constructor () {
    super({})
    this.form = new Form({})
    this.group = auth.retrieve('partner')
  }

  profile () {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.form.submit('get', url(`partners/${this.group.id}/driver`))
        resolve(response)
      } catch (err) {
        reject(err)
      }
    })
  }
}
