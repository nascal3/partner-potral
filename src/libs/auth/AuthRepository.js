import { crypt } from "./services/crypt";
import { guard } from "./services/guard"

export const fields = {
  //Login properties
  email: null,
  phone: null,
  authenticator: 'otp',
  code: null,
  identifier: 'Email',

  //Register
  name: null,
  legal_entity_type: 'Company',
  country_id: null,
  administrator: {
    name: null,
    email: null,
    phone: null,
  },

  //Access control
  ...crypt,
  ...guard,
}