export const resources = [
  /** Dashboard routes */
  { name: 'countries', url: 'countries' },
  { name: 'vendorTypes', url: 'vendor-types' },
  { name: 'roles', url: `partners/:partner/roles` },
  { name: 'users', url: `partners/:partner/users` },
  { name: 'permissions', url: `partners/:partner/permissions`},
  { name: 'vehicles', url: `partners/:partner/vehicles` },
];

export const helpers = {
  /*
   * Make the first letter uppercase
   */
  upper: string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};
