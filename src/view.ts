import { Model } from "./types.ts";
import { zodSchemaSymbol } from "./validation.ts";
import { z, ZodObject, ZodRawShape, ZodTypeAny } from "./deps.ts";

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
      ) ?? {}) as ZodTypeAny | ZodRawShape;

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
