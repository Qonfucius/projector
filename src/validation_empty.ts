import { Validation } from "./validation.ts";
import { RawCreateParams } from "./deps.ts";

export const ValidationUndefined = (options?: RawCreateParams) =>
  Validation((s) => s.undefined(options));

export const ValidationNull = (options?: RawCreateParams) =>
  Validation((s) => s.null(options));

export const ValidationVoid = (options?: RawCreateParams) =>
  Validation((s) => s.void(options));
