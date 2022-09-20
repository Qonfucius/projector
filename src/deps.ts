export type { Target } from "https://deno.land/x/reflection@0.0.2/mod.ts";

export { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";
export { errorUtil } from "https://deno.land/x/zod@v3.18.0/helpers/errorUtil.ts";
import { ZodErrorMap } from "https://deno.land/x/zod@v3.18.0/ZodError.ts";
export type { ZodErrorMap } from "https://deno.land/x/zod@v3.18.0/ZodError.ts";
export type {
  ZodRawShape,
  ZodTypeAny,
} from "https://deno.land/x/zod@v3.18.0/types.ts";
export { ZodObject } from "https://deno.land/x/zod@v3.18.0/types.ts";
export type { Primitive } from "https://deno.land/x/zod@v3.18.0/helpers/typeAliases.ts";

export type RawCreateParams =
  | {
    errorMap?: ZodErrorMap;
    invalid_type_error?: string;
    required_error?: string;
    description?: string;
  }
  | undefined;
