import { crypt } from "./services/crypt";
import { guard } from "./services/guard"

export const fields = {
  email: null,
  authenticator: 'otp',
  code: null,
  ...crypt,
  ...guard,
}