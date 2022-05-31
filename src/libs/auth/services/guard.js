export const guard = {
  /**
   * Checks weather the authenticated user has the permission to perform an action
   */
  can: (permission) => {
    const abilities = auth.retrieve('abilities') || []
    return abilities.find(ability => ability.name === `partner::${permission}`)
  },

  /**
   * Fetch user abilities and grant them to the authenticated user
   */
  permit: (partner = null) => {
    return new Promise(async (resolve, reject) => {
      try {
        const abilities = auth.retrieve('abilities') || []
        resolve(abilities);
      } catch (err) {
        reject(err);
      }
    });
  },
}
