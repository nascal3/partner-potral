export const guard = {
  /**
   * Checks if the authenticated user has the permission to perform an action
   */
  can: (permission) => {
    const abilities = auth.retrieve('permissions')
    return abilities.includes(`identity::${permission}`)
  },
}
