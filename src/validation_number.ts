import { Validation } from "./validation.ts";
import { errorUtil, RawCreateParams } from "./deps.ts";

export const ValidationNumber = (options?: RawCreateParams) =>
  Validation((s) => s.number(options));

ValidationNumber.gt = (comparator: number, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().gt(comparator, message));
ValidationNumber.gte = (comparator: number, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().gte(comparator, message));
ValidationNumber.lt = (comparator: number, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().lt(comparator, message));
ValidationNumber.lte = (comparator: number, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().lte(comparator, message));

ValidationNumber.int = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().int(message));

ValidationNumber.positive = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().positive(message));
ValidationNumber.nonnegative = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().nonnegative(message));
ValidationNumber.negative = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().negative(message));
ValidationNumber.nonpositive = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.number().nonpositive(message));

ValidationNumber.multipleOf = (
  multiple: number,
  message?: errorUtil.ErrMessage,
) => Validation((s) => s.number().multipleOf(multiple, message));
