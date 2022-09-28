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

export function ProjectionFactory<I, A = any>(model: Model<I> | typeof Object = Object) {
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
    //deno-lint-ignore no-explicit-any
    async map(validData: any, args?: any): Promise<I> {
    //? 1. is validArgs useful ?
    //? 2. Do I set an await ? or just let Promise<I> And we only await on the overload of the functin once in Steuli ?
      return new (this.constructor as typeof Projection)[modelSymbol]!(validData) as Promise<I>;
    }
    async toModel(args?: A): Promise<I> {
      const constructor = this.constructor as typeof Projection;
      let schema = (constructor)[schemaSymbol]!;
      if (!schema) {
        schema = (constructor).buildSchema();
      }

      const parsedData = schema.parse(this) as Promise<I>
      
      return await this.map(parsedData, args)
    }
  };
}