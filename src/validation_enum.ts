import { RawCreateParams } from "./deps.ts";
import { Validation } from "./validation.ts";
import { EnumLike } from "./types.ts";

export const ValidationEnum = (
  list: [string, ...string[]],
  options?: RawCreateParams,
) => Validation((s) => s.enum(list, options));

ValidationEnum.native = <T extends EnumLike>(
  list: T,
  options?: RawCreateParams,
) => Validation((s) => s.nativeEnum<T>(list, options));
