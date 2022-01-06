import Auth from '@/libs/auth/Auth'

const partner = (new Auth).retrieve('partner')
const partnerPrefix = `partners/${partner.id}`

export const resources = [
  /** Dashboard routes */
  // { name: 'dashboardStats', url: 'dashboard/stats' },
  // { name: 'dashboardGroups', url: 'dashboard/groups' },
  // { name: 'usersReport', url: 'reports/users' },
  // { name: 'rolesReport', url: 'reports/roles' },

  // { name: 'products', url: 'products' },
  // { name: 'permissions', url: 'permissions' },
  // { name: 'productGroups', url: 'product-groups' },
  // { name: 'productGroupUuids', url: 'product-group-uuids' },

  { name: 'roles', url: `${partnerPrefix}/roles` },
  { name: 'users', url: `${partnerPrefix}/users` },
  // { name: 'groupPermissions', url: 'identity/internal/permissions' },
];

export const helpers = {
  /*
   * Make the first letter uppercase
   */
  upper: string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};
