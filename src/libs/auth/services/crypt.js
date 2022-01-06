const app = process.env.VUE_APP_PORTAL

export const crypt = {
  /**
   * Encrypt the authenticated user's data
   */
  encrypt: (data) => {
    let encrypted = {}
    Object.keys(data).forEach(key => {
      encrypted[key] = btoa(JSON.stringify(data[key]))
    })
    localStorage.setItem(app, btoa(
      JSON.stringify(encrypted)
    ))
  },

  /**
   * Decrypt the authenticated user's data
   */
  decrypt: () => {
    const portal = localStorage.getItem(app)
    if (!portal) return null
    let decrypted = JSON.parse(atob(portal))
    for (let key in decrypted) {
      decrypted[key] = JSON.parse(atob(decrypted[key]))
    }
    return decrypted
  },

  /**
   * Retrieves the user's properties from the encrypted string
   */
  retrieve: (key) => {
    const decrypted = crypt.decrypt()
    return decrypted ? decrypted[key] : null
  },
}