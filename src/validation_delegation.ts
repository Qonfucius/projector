import { Validation } from "./validation.ts";
import { z } from "./deps.ts";

export const ValidationDelegation = (
  delegate: (zod: typeof z) => z.ZodTypeAny,
) => Validation(delegate);
