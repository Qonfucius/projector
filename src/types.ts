import { Target, z } from "./deps.ts";

export type ZodDerivationFunction = (zod: typeof z) => z.ZodTypeAny;
export type Decorator = <T extends Target>(
  target: T,
  propertyKey: keyof T,
) => void;

// deno-lint-ignore no-explicit-any
export type Model<T = any> = new (object?: T | undefined) => T;
export type EnumLike = { [k: string]: string | number; [nu: number]: string };
