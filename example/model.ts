import {
  Optional,
  Projection,
  ValidationString,
} from "../../../projector/mod.ts";

class RegistrationProjection<T> extends Projection<T> {
  @ValidationString.email()
  @Optional()
  public readonly email: string;
}

class User {
  constructor(obj?: Partial<User>) {
    Object.assign(this, obj);
  }
  id: string;
  password: string;
  email: string;
}

const registration = RegistrationProjection.import<object>({});
console.log("transformed", registration.transform(User));
