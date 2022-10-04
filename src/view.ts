import { Model } from "./types.ts";
import { zodSchemaSymbol } from "./validation.ts";
import { z, ZodRawShape, ZodTypeAny } from "./deps.ts";
import {
  zodSchemaNullableSymbol,
  zodSchemaOptionalSymbol,
} from "./modifiers.ts";

export const modelSymbol = Symbol("model");
export const validatorSymbol = Symbol("schema");
//deno-lint-ignore no-explicit-any
export interface Projection<M, A = any> {
  //deno-lint-ignore no-explicit-any
  project(data: any, arg?: A): M;
}

//deno-lint-ignore no-explicit-any
export function ProjectionFactory<M, A = any>(
  model: Model<M> | typeof Object = Object,
) {
  return class Projection {
    static [modelSymbol]: Model<M> | typeof Object = model;
    static [validatorSymbol]: Record<string, ZodTypeAny>;

    protected constructor() {}

    private static getValidators() {
      if (this[validatorSymbol]) {
        return this[validatorSymbol];
      }

      const validators: ZodRawShape = (Reflect.getMetadata(
        zodSchemaSymbol,
        this,
      ) ?? {}) as ZodRawShape;

      const optionsSet = (Reflect.getMetadata(
        zodSchemaOptionalSymbol,
        this.constructor,
      ) ?? new Set()) as Set<string>;

      const nullableSet = (Reflect.getMetadata(
        zodSchemaNullableSymbol,
        this.constructor,
      ) ?? new Set()) as Set<string>;

      for (const option of optionsSet) {
        validators[option] = z.optional(validators[option]);
      }

      for (const nullable of nullableSet) {
        validators[nullable] = z.nullable(validators[nullable]);
      }
      return (this[validatorSymbol] = validators);
    }

    project(_args?: A) {
      return Promise.resolve(new model(this));
    }

    //deno-lint-ignore no-explicit-any
    static apply(userData: any, args?: A) {
      const instance = new this();

      //deno-lint-ignore no-explicit-any
      const issues: any[] = [];
      let isValid = true;

      for (const [key, validator] of Object.entries(this.getValidators())) {
        const typedKey = key as keyof typeof instance;
        try {
          instance[typedKey] = validator.parse(userData[typedKey]);
        } catch (e) {
          isValid = false;
          if (e instanceof z.ZodError) {
            e.issues.forEach((issue) => {
              issue.path.push(typedKey);
            });
            issues.push(...e.issues);
          } else {
            issues.push({
              code: "unknown_type",
              message: e.message,
              path: [typedKey],
            });
          }
        }
      }

      if (!isValid) {
        throw new z.ZodError(issues);
      }

      return instance.project(args);
    }
  };
}
