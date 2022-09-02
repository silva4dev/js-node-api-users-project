import User from "../models/User";
import PasswordToken from "../models/PasswordToken";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import secret  from "../helpers/secret";
import { Joi } from "express-validation";

class UserController {
  async index(request, response) {
    const users = await User.findAll();
    response.json({ users });
  }

  async create(request, response) {
    const { email, name, password } = request.body;
    const { error } = this.validator().validate(request.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    const isEmailExist = await User.checkEmailExist(email);
    const errors = [];

    if (error) {
      error.details.forEach((detail) => {
        const message = detail.message;
        detail.path.forEach((value) => {
          errors.push({ [value]: message });
        });
      });
    }

    if (errors.length > 0) {
      response.status(400).json({
        errors: errors,
      });
    } else {
      if (isEmailExist instanceof Error) {
        response.status(406).json({
          errors: [{ email: isEmailExist.message }],
        });
      } else {
        await User.create(name, email, password);
        response.status(200).json({ msg: "Usuário cadastrado com sucesso!" });
      }
    }
  }

  async show(request, response) {
    const { id } = request.params;
    const user = await User.findById(id);
    if (user == undefined) {
      response.status(404).json({});
    } else {
      response.status(200).json(user);
    }
  }

  async edit(request, response) {
    const { name, role, email } = request.body;
    const { id } = request.params;
    const { error } = this.validator().validate(request.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    const isEmailExist = await User.checkEmailExist(email);
    const errors = [];

    if (error) {
      error.details.forEach((detail) => {
        const message = detail.message;
        detail.path.forEach((value) => {
          errors.push({ [value]: message });
        });
      });
    }

    if (errors.length > 0) {
      response.status(400).json({
        errors: errors,
      });
    } else {
      if (isEmailExist instanceof Error) {
        response.status(406).json({
          errors: [{ email: isEmailExist.message }],
        });
      } else {
        const user = await User.update(id, email, name, role);
        if (user != undefined) {
          if (user.status) {
            response.status(200).json({
              msg: "Usuário atualizado com sucesso!",
            });
          } else {
            response.status(406).json({ error: user.error });
          }
        } else {
          response.status(406).json({
            msg: "Ocorreu um erro ao atualizar o usuário",
          });
        }
      }
    }
  }

  async delete(request, response) {
    const { id } = request.params;
    const user = await User.destroy(id);
    if (user.status) {
      response.status(200).json({ msg: "Usuário deletado com sucesso!" });
    } else {
      response.status(406).json({ error: user.error });
    }
  }

  async recoverPassword(request, response) {
    const { email } = request.body;
    const password = await PasswordToken.create(email);
    if (password.status) {
      response.status(200).json({
        token: password.token,
      });
    } else {
      response.status(406).json({
        error: password.error,
      });
    }
  }

  async changePassword(request, response) {
    const { token, password } = request.body;
    const isTokenValid = await PasswordToken.checkTokenUsed(token);
    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      response.status(200).json({
        msg: "Senha alterada com sucesso!",
      });
    } else {
      response.status(406).json({
        msg: "Token inválido!",
      });
    }
  }

  async login(request, response) {
    const { email, password } = request.body;
    const user = await User.getEmail(email);
    if (user != undefined) {
      const isEqualPassword = await bcrypt.compare(password, user.password);
      if (isEqualPassword) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret);
        response.status(200).json({ token });
      } else {
        response.status(406).json({
          msg: "Senha incorreta!",
        });
      }
    } else {
      response.status(406).json({
        status: false,
      });
    }
  }

  validator() {
    return Joi.object().keys({
      name: Joi.string().min(3).max(50).required().trim(true).messages({
        "string.base": "O campo nome precisa ser do tipo string",
        "string.empty": "O campo nome não pode ser vazio",
        "any.required": "O campo nome é obrigatório",
        "string.min": "O campo senha deve ter no mínimo 3 caracteres",
        "string.max": "O campo senha deve ter no máximo 50 caracteres",
      }),
      email: Joi.string().email().max(150).trim(true).required().messages({
        "string.base": "O campo e-mail precisa ser do tipo string",
        "string.empty": "O campo e-mail não pode ser vazio",
        "string.email": "Formato inválido de e-mail",
        "any.required": "O campo e-mail é obrigatório",
        "string.max": "O campo e-mail deve ter no máximo 150 caracteres",
      }),
      password: Joi.string().min(6).max(200).required().trim(true).messages({
        "string.base": "O campo senha precisa ser do tipo string",
        "string.empty": "O campo senha não pode ser vazio",
        "any.required": "O campo senha é obrigatório",
        "string.min": "O campo senha deve ter no mínimo 6 caracteres",
        "string.max": "O campo senha deve ter no máximo 200 caracteres",
      }),
    });
  }
}

export default new UserController();

