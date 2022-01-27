import { crypt } from "./services/crypt";
import { guard } from "./services/guard"

export const fields = {
  //Login properties
  email: null,
  phone: null,
  authenticator: 'otp',
  code: null,
  identifier: 'Email',
  product_group: 'partner',

  //Register
  business_name: null,
  legal_entity_type: 'Individual',
  country_id: 1,
  administrator: {
    name: null,
    email: null,
    phone: null,
  },

  //Access control
  ...crypt,
  ...guard,
}