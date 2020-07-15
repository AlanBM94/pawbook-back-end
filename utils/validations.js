const { check } = require("express-validator");

const checkValidations = (value, valueType) => {
  let checkType = () => {
    let callback;
    const errorMessage = `${value} has to be a ${valueType}`;
    if (valueType === "string")
      callback = check(value, errorMessage).isString();
    if (valueType === "number")
      callback = check(value, errorMessage).isNumeric();
    if (valueType === "url") callback = check(value, errorMessage).isURL();
    if (valueType === "email") callback = check(value, errorMessage).isEmail();
    return callback;
  };

  return [check(value, `${value} is required`).not().isEmpty(), checkType()];
};

module.exports = {
  animalValidations: [
    checkValidations("name", "string"),
    checkValidations("scientificName", "string"),
    checkValidations("location", "string"),
    checkValidations("weight", "number"),
    check("size.height", "height has to be a number").isNumeric(),
    check("size.longitud", "longitud has to be a number").isNumeric(),
    checkValidations("species", "string"),
    checkValidations("type", "string"),
    checkValidations("averageLifeTime", "number"),
    checkValidations("ecosystem", "string"),
    checkValidations("description", "string"),
    checkValidations("numberOfSpecimensInFreedom", "number"),
    checkValidations("diet", "string"),
    checkValidations("association", "url"),
    checkValidations("picture", "string"),
  ],
  isAValidObjectId: (id) => id.match(/^[0-9a-fA-F]{24}$/),
  signUpValidations: [
    checkValidations("user", "string"),
    checkValidations("email", "email"),
    checkValidations("password", "string"),
    checkValidations("passwordConfirm", "string"),
  ],
  updateUserValidations: [
    checkValidations("user", "string"),
    checkValidations("email", "email"),
  ],
  changePasswordValidations: [
    checkValidations("passwordCurrent", "string"),
    checkValidations("password", "string"),
    checkValidations("passwordConfirm", "string"),
  ],
  logInValidations: [
    checkValidations("email", "email"),
    checkValidations("password", "string"),
  ],
};
