const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmpassword = !isEmpty(data.confirmpassword)
    ? data.confirmpassword
    : "";

  if (
    !Validator.isLength(data.name, {
      min: 2,
      max: 30
    })
  ) {
    errors.name = "Name must be between 2 and 30 characters";
  }
  // Name
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  // Email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  // Password
  if (
    !Validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  // Password confirm
  if (!Validator.equals(data.password, data.confirmpassword)) {
    errors.confirmpassword = "Passwords must match";
  }

  if (Validator.isEmpty(data.confirmpassword)) {
    errors.confirmpassword = "Confirm password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
