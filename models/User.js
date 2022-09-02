import knex from "../database/connection";
import bcrypt from "bcrypt";
import PasswordToken from "./PasswordToken";

class User {
  async findAll() {
    try {
      const users = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      return users;
    } catch (error) {
      return [];
    }
  }

  async findById(id) {
    try {
      const user = await knex
        .select(["id", "name", "email", "role"])
        .where({ id })
        .table("users");
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  async getEmail(email) {
    try {
      const user = await knex
        .select(["id", "name", "email", "password", "role"])
        .where({ email })
        .table("users");
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }

  async create(name, email, password) {
    try {
      const hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ name, email, password: hash, role: 0 })
        .table("users");
    } catch (error) {
      return error;
    }
  }

  async checkEmailExist(email) {
    try {
      const isEmailExist = await knex
        .select("email")
        .where({ email })
        .from("users");
      if (isEmailExist.length > 0) {
        throw new Error("Esse e-mail já está cadastrado!");
      }
    } catch (error) {
      return error;
    }
  }

  async update(id, email, name, role) {
    const user = await this.findById(id);
    if (user != undefined) {
      const form = {};
      if (email != undefined || name != undefined || role != undefined) {
        if (email != user.email) {
          const isEmailExist = await this.checkEmailExist(email);
          if (!isEmailExist) {
            form.email = email;
          } else {
            return { status: false, error: "Esse e-mail já está cadastrado!" };
          }
        }
        form.name = name;
        form.role = role;
      }
      try {
        await knex.update(form).where({ id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, error };
      }
    } else {
      return {
        status: false,
        error: "Esse usuário não existe!",
      };
    }
  }

  async destroy(id) {
    const user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, error };
      }
    } else {
      return { status: false, error: "Esse usuário não existe!" };
    }
  }

  async changePassword(newPassword, id, token) {
    const hash = await bcrypt.hash(newPassword, 10);
    await knex.update({ password: hash }).where({ id }).table("users");
    await PasswordToken.setUsed(token);
  }
}

export default new User();
