import knex from "../database/connection";
import User from "./User";
import { v1 as uuidv1 } from "uuid";

class PasswordToken {
  async create(email) {
    const user = await User.getEmail(email);
    if (user != undefined) {
      try {
        const token = uuidv1();
        await knex
          .insert({
            user_id: user.id,
            used: 0,
            token,
          })
          .table("password_tokens");
        return { status: true, token };
      } catch (error) {
        return { status: false, error };
      }
    } else {
      return { status: false, error: "Esse e-mail não existe!" };
    }
  }

  async checkTokenUsed(token) {
    try {
      const isTokenExist = await knex
        .select()
        .where({ token })
        .from("password_tokens");
      if (isTokenExist.length > 0) {
        const currentToken = isTokenExist[0];
        if (currentToken.used) {
          return { status: false };
        } else {
          return { status: true, token: currentToken };
        }
      } else {
        return { status: false };
      }
    } catch (error) {
      return { status: false };
    }
  }

  async setUsed(token) {
    await knex.update({ used: 1 }).where({ token }).table("password_tokens");
  }
}

export default new PasswordToken();
