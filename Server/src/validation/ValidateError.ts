import { InvalidDataTypeException } from "../error/InvalidDataTypeException";
import { InvalidDateException } from "../error/InvalidDateFormatException";
import { InvalidEmailException } from "../error/InvalidEmailException";
import { InvalidPasswordException } from "../error/InvalidPasswordException";
import { InvalidPayLoadException } from "../error/InvalidPayLoadException";
import { MissingDataFieldException } from "../error/MissingDataFieldException";

export const validateError = (error: any) => {
  console.log(error[0].code);
  switch (error[0].code) {
    case "string.base": {
      return new InvalidDataTypeException();
    }

    case "number.base": {
      return new InvalidDataTypeException();
    }

    case "date.greater": {
      return new InvalidDateException();
    }

    case "date.format": {
      return new InvalidDateException();
    }

    // A required value wasn't present.
    case "any.required": {
      return new MissingDataFieldException();
    }

    // A value was present while it wasn't expected.
    case "any.unknown": {
      return new InvalidPayLoadException();
    }
    default: {
      return new InvalidDataTypeException();
    }
  }
};
