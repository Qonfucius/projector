import * as Projector from "../mod.ts";

enum Role {
  Admin = "admin",
  Editor = "editor"
}

interface IUser {
  surname: string;
  email: string;
  password: string;
  role: Role
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
RegistrationProjection.buildSchema();

const userRaw = {
  surname: "surname",
  email: "email@email.com",
  password: "password",
  role: "not a valid role",
};

const userProjection: RegistrationProjection = new RegistrationProjection();
userProjection.assign(userRaw);

userProjection.toModel();
