import Errors from './Errors';

export default class Form {
  constructor (fields) {
    this.fields = fields
    this.errors = new Errors(fields)
  }

  /*
   * Save the data that has been passed to the form into the database
   */
  submit (request, url, record) {
    return new Promise((resolve, reject) => {
      let call = request === "get" || request === "delete"
        ? axios[request](url, visa()) 
        : axios[request](url, record, visa())

      call.then(({data}) => {
        resolve(data)
      }).catch(({ response }) => {
        const { status, data } = response
        // if (status === 403) {
        //   location = '/unauthorised'
        // }
        // if (status && status === 404) {
        //   location = '/unavailable'
        // }
        this.errors.record(data)
        reject(response)
      })
    })
  }
}
