import { RawCreateParams, Target, z, ZodTypeAny } from "./deps.ts";
import { Validation, zodSchemaSymbol } from "./validation.ts";
import { Decorator, ZodDerivationFunction } from "./types.ts";

export const zodSchemaNullableSymbol = Symbol("nullable keys");
export const zodSchemaOptionalSymbol = Symbol("optional keys");

export function Nullable(): Decorator {
  return function decorator<T extends Target>(
    target: T,
    propertyKey: keyof T,
  ): void {
    const keys = (Reflect.getMetadata(
      zodSchemaNullableSymbol,
      target.constructor,
    ) ?? new Set()) as Set<keyof T>;
    keys.add(propertyKey);
    Reflect.defineMetadata(
      zodSchemaNullableSymbol,
      keys,
      target.constructor,
    );
  };
}

export function Optional(): Decorator {
  return function decorator<T extends Target>(
    target: T,
    propertyKey: keyof T,
  ): void {
    const keys = (Reflect.getMetadata(
      zodSchemaOptionalSymbol,
      target.constructor,
    ) ?? new Set()) as Set<keyof T>;
    keys.add(propertyKey);
    Reflect.defineMetadata(
      zodSchemaOptionalSymbol,
      keys,
      target.constructor,
    );
  };
}
