import { InvalidPasswordException } from "../error/InvalidPasswordException";
import { InvalidEmailException } from "../error/InvalidEmailException";
import { InvalidDataTypeException } from "../error/InvalidDataTypeException";
import { validateError } from "./ValidateError";

import Joi from "joi";

export const TimeSlotReservationSchema = Joi.object({
  timeslot_id: Joi.number().required().error(validateError),
});
