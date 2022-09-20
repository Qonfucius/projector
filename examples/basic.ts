import "https://deno.land/x/reflection@0.0.2/mod.ts";
import * as Projector from "../mod.ts";

// Example without constructor class

interface Choupi {
  surname: string;
}
export class ChoupiProjection extends Projector.ProjectionFactory<Choupi>() {
  @Projector.ValidationString()
  public readonly surname!: string;
}

const choupiRaw = {
  surname: "surname",
};

const choupiProjection = new ChoupiProjection();
choupiProjection.assign(choupiRaw);

choupiProjection.toModel(); // Ok

// Example with constructor class

enum Role {
  Admin = "admin",
  Editor = "editor",
}

interface IUser {
  surname: string;
  email: string;
  password: string;
  role: Role;
}

class User implements IUser {
  surname!: string;
  email!: string;
  password!: string;
  role!: Role;

  constructor(o: IUser) {
    Object.assign(this, o);
  }
}

export class RegistrationProjection extends Projector.ProjectionFactory(User) {
  @Projector.ValidationString()
  public readonly surname!: string;

  @Projector.ValidationString.email()
  public readonly email!: string;

  @Projector.ValidationString.min(6)
  @Projector.ValidationString.max(20)
  public readonly password!: string;

  @Projector.ValidationEnum(["admin", "editor"])
  public readonly role!: string;
}

const userRaw = {
  surname: "surname",
  email: "email@email.com",
  password: "password",
  role: "not a valid role",
};

const userProjection: RegistrationProjection = new RegistrationProjection();
userProjection.assign(userRaw);

userProjection.toModel(); // Error

