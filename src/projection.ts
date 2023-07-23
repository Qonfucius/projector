import { zodSchemaSymbol } from "./validation.ts";
import { z, ZodObject, ZodRawShape } from "./deps.ts";
import {
  zodSchemaNullableSymbol,
  zodSchemaOptionalSymbol,
} from "./modifiers.ts";
import { mapperSymbol } from "./mapper.ts";
import { FlavoredConstructor, MappingRegistry, Transformer } from "./types.ts";

export const rawDataSymbol = Symbol("raw data");
export const dataSymbol = Symbol("data");
export const isValidSymbol = Symbol("is valid");
export const schemaSymbol = Symbol("schema");

export class Projection<T> {
  constructor() {
    const constructor = this.constructor as typeof Projection;
    if (!constructor[schemaSymbol]) {
      constructor.build();
    }
    return this;
  }

  [rawDataSymbol]?: T;
  [dataSymbol]?: z.infer<ZodObject<ZodRawShape>>;
  [isValidSymbol]: boolean = false;
  static [schemaSymbol]?: ZodObject<ZodRawShape>;

  static import<U>(data: U): Projection<U> {
    const o = new this<U>();
    o[rawDataSymbol] = data;
    return o;
  }

  static build() {
    const metadataSchema: ZodRawShape = (Reflect.getMetadata(
      zodSchemaSymbol,
      this,
    ) ?? {}) as ZodRawShape;

    const optionsSet = (Reflect.getMetadata(
      zodSchemaOptionalSymbol,
      this,
    ) ?? new Set()) as Set<string>;

    const nullableSet = (Reflect.getMetadata(
      zodSchemaNullableSymbol,
      this,
    ) ?? new Set()) as Set<string>;

    for (const option of optionsSet) {
      metadataSchema[option] = z.optional(metadataSchema[option]);
    }

    for (const nullable of nullableSet) {
      metadataSchema[nullable] = z.nullable(metadataSchema[nullable]);
    }

    this[schemaSymbol] = (metadataSchema instanceof ZodObject)
      ? metadataSchema
      : z.object(metadataSchema as ZodRawShape);
    return this;
  }

  protected validate() {
    const constructor = this.constructor as typeof Projection;
    this[dataSymbol] =
      (constructor[schemaSymbol] as z.infer<ZodObject<ZodRawShape>>).parse(
        this[rawDataSymbol],
      );
    this[isValidSymbol] = true;
    return this;
  }

  public transform<U>(cls: FlavoredConstructor<U>): U {
    if (!this[isValidSymbol]) {
      this.validate();
    }

    const mappingMeta: MappingRegistry = Reflect.getMetadata(
      mapperSymbol,
      this.constructor,
    ) ?? {};
    const identifier = cls.symbol ?? cls.name;
    const data = Object.entries(mappingMeta?.[identifier] ?? {}).reduce(
      (data, [key, { to = [] }]) => {
        return {
          ...to.reduce(
            (acc: z.infer<ZodObject<ZodRawShape>>, fn: Transformer) => ({
              ...fn(acc, key),
            }),
            data,
          ),
        };
      },
      { ...this[dataSymbol] },
    );

    return new cls(data);
  }
}
