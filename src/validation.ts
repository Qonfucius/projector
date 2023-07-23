import { Target, z, ZodRawShape } from "./deps.ts";
import { Decorator, ZodDerivationFunction } from "./types.ts";

export const zodSchemaSymbol = Symbol("zod-projection library schema");

/**
 * List of zod schema that will be union. (Use many decorators to do an intersection)
 *
 * @param derivation
 * @param otherDerivations
 */
export function Validation(
  derivation: ZodDerivationFunction,
  ...otherDerivations: ZodDerivationFunction[]
): Decorator {
  return function decorator<T extends Target>(
    target: T,
    propertyKey: keyof T,
  ): void {
    const schema = (Reflect.getMetadata(
      zodSchemaSymbol,
      target.constructor,
    ) ?? {}) as ZodRawShape;
    let u = derivation(z);
    if (otherDerivations.length > 0) {
      u = z.union([
        u,
        otherDerivations[0](z),
        ...otherDerivations.splice(1).map((d) => d(z)),
      ]);
    }
    schema[propertyKey as string] = schema[propertyKey as string]
      ? z.intersection(schema[propertyKey as string], u)
      : u;
    Reflect.defineMetadata(
      zodSchemaSymbol,
      schema,
      target.constructor,
    );
  };
}
