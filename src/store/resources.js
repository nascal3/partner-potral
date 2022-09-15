export const resources = [
  /** Dashboard routes */
  { name: 'countries', url: 'countries' },
  { name: 'languages', url: 'languages' },
  { name: 'country', url: 'countries/:id' },
  { name: 'documents', url: 'documents' },
  { name: 'vendorTypes', url: 'vendor-types' },
  { name: 'roles', url: `partners/:partner/roles` },
  { name: 'users', url: `partners/:partner/users` },
  { name: 'permissions', url: `partners/:partner/permissions`},
  { name: 'vehicles', url: `partners/:partner/vehicles` },
  { name: 'vehicleDocuments', url: `partners/:partner/document-submissions` },
  { name: 'transporters', url: `partners/:partner/transporters` },
  { name: 'banks', url: `banks` },
  { name: 'accountBalance', url: `partners/:partner/finances/account-balance` },
  { name: 'partnerTransactions', url: `partners/:partner/finances/transactions` },
  { name: 'unclearedEarnings', url: `partners/:partner/finances/uncleared-earnings` },
  { name: 'withdrawals', url: `partners/:partner/finances/withdrawals` },
  { name: 'paymentMethods', url: `partners/:partner/finances/payment-methods` },
  { name: 'legalDocuments', url: `partners/:partner/document-submissions` },
  { name: 'vehicleLegalDocuments', url: `partners/:partner/document-submissions` },
  { name: 'driverLegalDocuments', url: `partners/:partner/document-submissions` },
  { name: 'individualLegalDocuments', url: `partners/:partner/document-submissions` },
  { name: 'businessLegalDocuments', url: `partners/:partner/document-submissions` }
];

export const helpers = {
  /*
   * Make the first letter uppercase
   */
  upper: string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};
