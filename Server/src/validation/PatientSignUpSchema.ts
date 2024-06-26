import { InvalidPasswordException } from "../error/InvalidPasswordException";
import { InvalidEmailException } from "../error/InvalidEmailException";
import { InvalidDataTypeException } from "../error/InvalidDataTypeException";
import { validateError } from "./ValidateError";

const Joi = require("joi").extend(require("@joi/date"));
export const PatientSignUpSchema = Joi.object({
  FirstName: Joi.string().required().error(validateError),
  LastName: Joi.string().required().error(new InvalidDataTypeException()),
  Email: Joi.string().email().required().error(new InvalidEmailException()),
  Password: Joi.string()
    .min(3)
    // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .error(new InvalidPasswordException()),
  Gender: Joi.string().required().error(new InvalidDataTypeException()),
  DOB: Joi.date().iso().greater("now").required().error(validateError),
});
