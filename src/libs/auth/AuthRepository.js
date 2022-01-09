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
  name: 'Knowhere Logistics',
  legal_entity_type: 'Company',
  country_id: 1,
  administrator: {
    name: 'Francis Kisiara',
    email: 'franciskisiara@gmail.com',
    phone: null,
  },

  //Access control
  ...crypt,
  ...guard,
}