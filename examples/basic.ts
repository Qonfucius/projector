import "https://deno.land/x/reflection@0.0.2/mod.ts";
import * as Projector from "../mod.ts";

// Example without constructor class

interface Choupi {
  surname: string;
}
export class ChoupiProjection extends Projector.ProjectionFactory<Choupi>() {
  @Projector.ValidationDelegation((z) => z.number())
  public readonly age!: number;
  @Projector.ValidationDelegation((z) => z.string().email().min(5))
  public readonly email!: string;
}

const choupiRaw = {
  age: 22,
  email: "uoupi@gmail.com",
};

console.log(await ChoupiProjection.apply(choupiRaw));

// Example with constructor class

// enum Role {
//   Admin = "admin",
//   Editor = "editor",
// }

// interface IUser {
//   surname: string;
//   email: string;
//   password: string;
//   role: Role;
// }

// class User implements IUser {
//   surname!: string;
//   email!: string;
//   password!: string;
//   role!: Role;

//   constructor(o: IUser) {
//     Object.assign(this, o);
//   }
// }

// export class RegistrationProjection extends Projector.ProjectionFactory(User) {
//   @Projector.ValidationString()
//   public readonly surname!: string;

//   @Projector.ValidationString.email()
//   public readonly email!: string;

//   @Projector.ValidationString.min(6)
//   @Projector.ValidationString.max(20)
//   public readonly password!: string;

//   @Projector.ValidationEnum(["admin", "editor"])
//   public readonly role!: string;
// }

// const userRaw = {
//   surname: "surname",
//   email: "email@email.com",
//   password: "password",
//   role: "not a valid role",
// };

// const userProjection: RegistrationProjection = new RegistrationProjection();
// userProjection.assign(userRaw);

// userProjection.toModel(); // Error
