import { Validation } from "./validation.ts";
import { errorUtil, RawCreateParams } from "./deps.ts";

export const ValidationDate = (options?: RawCreateParams) =>
  Validation((s) => s.date(options));

ValidationDate.preprocessor = (options?: RawCreateParams) =>
  Validation((s) =>
    s.preprocess((arg) => {
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, s.date(options))
  );

ValidationDate.min = (min: Date, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.date().min(min, message));
ValidationDate.max = (max: Date, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.date().max(max, message));
