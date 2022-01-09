export const guard = {
  /**
   * Checks if the authenticated user has the permission to perform an action
   */
  can: (permission) => {
    const abilities = auth.retrieve('abilities') || []
    return abilities.includes(`partner::${permission}`)
  },

  /** 
   * Fetch user abilities from the API and grant them to the authenticated user
   */
  permit: (partner = null) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { id } = partner || auth.retrieve('partner')
        const { data } = await axios.get(url(`partners/${id}/abilities`), visa())
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  },
}
