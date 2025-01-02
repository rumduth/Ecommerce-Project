const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
const Joi = require("joi");
const {
  usernameSchema,
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  validateRequestBody,
  validateJoiObjectSignIn,
} = require("../utils/joi/userJoiSchema");
const { off } = require("../models/User");

router.post(
  "/signup",
  validateRequestBody(
    Joi.object({
      username: usernameSchema,
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema,
    })
  ),
  controller.createUser
);

// Define the route with the middleware
router.post("/login", validateJoiObjectSignIn, controller.signIn);
// router.post("/logout", controller)
module.exports = router;
