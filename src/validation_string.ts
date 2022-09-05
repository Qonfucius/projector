import { Validation } from "./validation.ts";
import { errorUtil, RawCreateParams } from "./deps.ts";

export const ValidationString = (options?: RawCreateParams) =>
  Validation((s) => s.string(options));

ValidationString.isEmail = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().email(message));
