import { Target, z } from "./deps.ts";

export type ZodDerivationFunction = (zod: typeof z) => z.ZodTypeAny;
export type Decorator = <T extends Target>(
  target: T,
  propertyKey: keyof T,
) => void;

// deno-lint-ignore no-explicit-any
export type Model<T = any> = new (object?: T | undefined) => T;
export type EnumLike = { [k: string]: string | number; [nu: number]: string };

export type FlavoredConstructor<T> = {
  new (...args: unknown[]): T;
  symbol?: symbol;
  name: string;
};
export type PropertyKey = string | symbol;
export type Transformer = (source: object, key: PropertyKey) => object;
export type MappingRegistry = Record<
  PropertyKey,
  Record<PropertyKey, { from: Transformer[]; to: Transformer[] }>
>;
