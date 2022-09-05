import { Validation } from "./validation.ts";
import { Primitive, RawCreateParams } from "./deps.ts";

export const ValidationBigInt = (options?: RawCreateParams) =>
  Validation((s) => s.bigint(options));

export const ValidationBoolean = (options?: RawCreateParams) =>
  Validation((s) => s.boolean(options));

export const ValidationNaN = (options?: RawCreateParams) =>
  Validation((s) => s.nan(options));

export const ValidationAny = (options?: RawCreateParams) =>
  Validation((s) => s.any(options));

export const ValidationUnknown = (options?: RawCreateParams) =>
  Validation((s) => s.unknown(options));

export const ValidationNever = (options?: RawCreateParams) =>
  Validation((s) => s.never(options));

export const ValidationLiteral = (
  primitive: Primitive,
  options?: RawCreateParams,
) => Validation((s) => s.literal(primitive, options));
