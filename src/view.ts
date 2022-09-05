import { Model } from "./types.ts";
import { zodSchemaSymbol } from "./validation.ts";
import { z, ZodObject, ZodRawShape, ZodTypeAny } from "./deps.ts";
import {
  zodSchemaNullableSymbol,
  zodSchemaOptionalSymbol,
} from "./modifiers.ts";

export const modelSymbol = Symbol("model");
export const schemaSymbol = Symbol("schema");

export interface Projection<M extends Model> {
  toModel(): M;
}

export function ProjectionFactory<M extends Model>(model: M) {
  const c = class Projection {
    static [modelSymbol]?: M;
    static [schemaSymbol]?: ZodObject<ZodRawShape>;

    toModel(): M {
      const metadataSchema = (Reflect.getMetadata(
        zodSchemaSymbol,
        this.constructor,
      ) ?? {}) as {[key: string]: ZodTypeAny};

      const optionsSet = (Reflect.getMetadata(
          zodSchemaOptionalSymbol,
          this.constructor,
        ) ?? new Set()) as Set<string>;

      const nullableSet =  (Reflect.getMetadata(
          zodSchemaNullableSymbol,
          this.constructor,
        ) ?? new Set()) as Set<string>;

      for (const option of optionsSet) {
        metadataSchema[option] = z.optional(metadataSchema[option]);
      }

      for (const nullable of nullableSet) {
        metadataSchema[nullable] = z.nullable(metadataSchema[nullable]);
      }

      const schema = (metadataSchema instanceof ZodObject)
        ? metadataSchema
        : z.object(metadataSchema as ZodRawShape);
      const data = schema.parse(this);

      return new (<typeof Projection> this.constructor)[modelSymbol]!(
        data,
      ) as M;
    }
  };
  c[modelSymbol] = model;
  return c;
}
