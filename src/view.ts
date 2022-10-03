import { Model } from "./types.ts";
import { zodSchemaSymbol } from "./validation.ts";
import { z, ZodRawShape, ZodTypeAny } from "./deps.ts";
import {
  zodSchemaNullableSymbol,
  zodSchemaOptionalSymbol,
} from "./modifiers.ts";

export const modelSymbol = Symbol("model");
export const validatorSymbol = Symbol("schema");

export interface Projection<M extends Model> {
  apply(): M;
  project(): M;
  getValidators(): ZodRawShape;
  assign(o: Omit<this, keyof Projection<M>>): this;
}

//deno-lint-ignore no-explicit-any
export function ProjectionFactory<I, A = any>(model: Model<I> | typeof Object = Object) {
  return class Projection {
    static [modelSymbol]: Model<I> | typeof Object = model;
    static [validatorSymbol]?: Record<string, ZodTypeAny>;
    
    private static getValidators() {
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

      return this[validatorSymbol] = { ...metadataSchema };
    }
    
    project(_args?: A): Promise<I> {
      return Promise.resolve(new model(this) as I);
    }

    //deno-lint-ignore no-explicit-any
    static async apply(args?: A) {//
      this.getValidators()
      const instance = new model(args); //! <- new this() ?

      //deno-lint-ignore no-explicit-any
      let errors: any[] = [];
      let isValid = true;
      
      for (const [key, validator] of Object.entries(this[validatorSymbol] ?? {})) {
        try {
          //this[modelSymbol][key as keyof Model<I>] = await validator.parseAsync(instance[key as keyof Model<I>]);
          Object.assign(this, await validator.parseAsync(instance[key as keyof Model<I>])); //! bad assign ?
        } catch (e) {
          isValid = false;
          if (e instanceof z.ZodError) {
            //todo add path
            errors.push(e);
          } else {
            //todo new issue + path
            // throw new BadRequestError(e.message) ?;
          }
        }
      }
      
      if (isValid) {
        await this.project(); //! bad interface typing ?
        
      }
      
      
    }



    /* async apply(args?: A): Promise<I> {
       const constructor = this.constructor as typeof Projection;
       let schema = constructor[schemaSymbol]!;
       if (!schema) {
         schema = constructor.buildSchema();
       }
 
       const _parsedData = await schema.parseAsync(this)
       //todo error handling ?
       
       return await this.project(args)
     }*/
  };
}