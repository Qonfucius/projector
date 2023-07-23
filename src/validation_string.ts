import { Validation } from "./validation.ts";
import { errorUtil, RawCreateParams } from "./deps.ts";

export const ValidationString = (options?: RawCreateParams) =>
  Validation((s) => s.string(options));

ValidationString.email = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().email(message));

ValidationString.cuid = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().cuid(message));

ValidationString.uuid = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().uuid(message));

ValidationString.url = (message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().url(message));

ValidationString.max = (max: number, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().max(max, message));

ValidationString.min = (min: number, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().min(min, message));

ValidationString.exactLength = (
  length: number,
  message?: errorUtil.ErrMessage,
) => Validation((s) => s.string().length(length, message));

ValidationString.trim = () => Validation((s) => s.string().trim());

ValidationString.endsWith = (content: string, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().endsWith(content, message));

ValidationString.startsWith = (
  content: string,
  message?: errorUtil.ErrMessage,
) => Validation((s) => s.string().startsWith(content, message));

ValidationString.regex = (regex: RegExp, message?: errorUtil.ErrMessage) =>
  Validation((s) => s.string().regex(regex, message));
