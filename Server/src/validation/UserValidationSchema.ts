import { InvalidPasswordException } from "../error/InvalidPasswordException";
import { InvalidEmailException } from "../error/InvalidEmailException";
import { InvalidDataTypeException } from "../error/InvalidDataTypeException";
import { validateError } from "./ValidateError";

import Joi from "joi";

export const UserValidationSchema = Joi.object({
  Email: Joi.string().email().required().error(validateError),
  Password: Joi.string()
    .min(3)
    // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .error(validateError),
});
