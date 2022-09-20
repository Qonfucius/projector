import { Model } from "./types.ts";
import { zodSchemaSymbol } from "./validation.ts";
import { z, ZodObject, ZodRawShape, ZodTypeAny } from "./deps.ts";
import {
  zodSchemaNullableSymbol,
  zodSchemaOptionalSymbol,
} from "./modifiers.ts";

export const modelSymbol = Symbol("model");
export const schemaSymbol = Symbol("schema");

type ZodProjectionObject<M extends Model> = ZodObject<{
  [key: Omit<M, keyof Projection<M>>]: ZodTypeAny;
}>;

export interface Projection<M extends Model> {
  toModel(): M;
  assign(o: Omit<this, keyof Projection<M>>): this;
}

export function ProjectionFactory<I>(model: Model<I> | typeof Object = Object) {
  return class Projection {
    static [modelSymbol]: Model<I> | typeof Object = model;
    static [schemaSymbol]?: ZodProjectionObject<Model<I>>;

    static buildSchema() {
      const metadataSchema: ZodRawShape = (Reflect.getMetadata(
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
        metadataSchema[option] = z.optional(metadataSchema[option]);
      }

      for (const nullable of nullableSet) {
        metadataSchema[nullable] = z.nullable(metadataSchema[nullable]);
      }

      const schema = this[schemaSymbol] = (metadataSchema instanceof ZodObject)
        ? metadataSchema
        : z.object(metadataSchema);

      return schema;
    }

    assign(o: Omit<this, keyof Projection>) {
      Object.assign(this, o);
      return this;
    }

    toModel(): I {
      let schema = (<typeof Projection> this.constructor)[schemaSymbol]!;
      if (!schema) {
        schema = (<typeof Projection> this.constructor).buildSchema();
      }

      return new (<typeof Projection> this.constructor)[modelSymbol]!(
        schema.parse(this),
      ) as I;
    }
  };
}
