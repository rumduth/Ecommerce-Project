const Joi = require("joi");

// Constants
const MIN_LENGTH_USERNAME = 8;
const MAX_LENGTH_USERNAME = 40;
const MIN_LENGTH_PASSWORD = 6;
const MAX_LENGTH_PASSWORD = 20;
const ACCEPTABLE_EMAIL_DOMAIN = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
];

// Define your Joi schemas
const usernameSchema = Joi.string()
  .min(MIN_LENGTH_USERNAME)
  .max(MAX_LENGTH_USERNAME)
  .regex(/^[a-zA-Z0-9]+$/) // Alphanumeric only
  .required();

const emailSchema = Joi.string()
  .min(MIN_LENGTH_USERNAME)
  .max(MAX_LENGTH_USERNAME)
  .email({ minDomainSegments: 2 })
  .custom((value, helpers) => {
    const [localPart, emailDomain] = value.split("@");
    if (!ACCEPTABLE_EMAIL_DOMAIN.includes(emailDomain.toLowerCase())) {
      return helpers.message(
        `We currently do not support your email domain! Please use ${ACCEPTABLE_EMAIL_DOMAIN.join(
          ", "
        )} accounts to sign up!`
      );
    }
    return value;
  })
  .required();

const passwordSchema = Joi.string()
  .min(MIN_LENGTH_PASSWORD)
  .max(MAX_LENGTH_PASSWORD)
  .regex(/[A-Z]/) // At least one uppercase letter
  .regex(/[a-z]/) // At least one lowercase letter
  .regex(/[0-9]/) // At least one number
  .regex(/[~!@#$%^&*()_]/) // At least one special character
  .required();

const confirmPasswordSchema = Joi.string()
  .valid(Joi.ref("password")) // Must match password
  .required();

// Export the schemas for use in other files
const validateRequestBody = (schema, isSignIn, signWithEmail) => {
  return (req, res, next) => {
    if (isSignIn) {
      const userInput = {};
      if (signWithEmail) {
        userInput.email = req.body.username;
        userInput.password = req.body.password;
      } else {
        userInput.username = req.body.username;
        userInput.password = req.body.password;
      }
      console.log(userInput);
      const { error, value } = schema.validate(userInput, {
        abortEarly: false,
      });
      if (error) {
        const errorDetails = error.details.map((err) => ({
          message: err.message,
          path: err.path,
        }));
        return res.status(400).json({ errors: errorDetails });
      }
      req.validatedBody = value; // Attach the validated body to the request
    } else {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorDetails = error.details.map((err) => ({
          message: err.message,
          path: err.path,
        }));
        return res.status(400).json({ errors: errorDetails });
      }
      req.validatedBody = value; // Attach the validated body to the request
    }
    next(); // Proceed to the next middleware or route handler
  };
};

const validateJoiObjectSignIn = function (req, res, next) {
  const { username } = req.body;
  // Check if the username is an email or just a username
  const schema = username.includes("@")
    ? Joi.object({
        email: emailSchema,
        password: passwordSchema,
      })
    : Joi.object({
        username: usernameSchema,
        password: passwordSchema,
      });
  const signWithEmail = username.includes("@");
  // Call validateRequestBody middleware for validation
  validateRequestBody(schema, true, signWithEmail)(req, res, next); // Use req, res, next as Express does
};

module.exports = {
  usernameSchema,
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  validateRequestBody,
  validateJoiObjectSignIn,
};
