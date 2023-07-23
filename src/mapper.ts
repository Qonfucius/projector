import type { MappingRegistry, PropertyKey, Transformer } from "./types.ts";
import { Target } from "./deps.ts";

export const mapperSymbol = Symbol("mappers");

export function map<T>(
  obj: { new (...args: unknown[]): T; symbol?: symbol; name: string },
  { from, to }: { from?: Transformer; to?: Transformer },
) {
  return function decorator<T extends Target>(
    target: T,
    propertyKey: keyof T,
  ): void {
    const identifier: string | symbol = obj.symbol ?? obj.name;
    const registry: MappingRegistry = Reflect.getMetadata(
      mapperSymbol,
      target.constructor,
    ) ?? {};
    registry[identifier] = registry[identifier] ?? {};
    registry[identifier][propertyKey as PropertyKey] =
      registry[identifier][propertyKey as PropertyKey] ?? { from: [], to: [] };
    if (from) {
      registry[identifier][propertyKey as PropertyKey].from.push(from);
    }
    if (to) {
      registry[identifier][propertyKey as PropertyKey].to.push(to);
    }
    Reflect.defineMetadata(
      mapperSymbol,
      registry,
      target.constructor,
    );
  };
}

export function mapTo<T extends object>(
  target: new (...args: unknown[]) => T,
  to: Transformer,
) {
  return map(target, { to });
}

export function mapFrom<T extends object>(
  target: new (...args: unknown[]) => T,
  from: Transformer,
) {
  return map(target, { from });
}
