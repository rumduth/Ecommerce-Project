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

function isValidUsername(username, error = {}) {
  let valid =
    username.length >= MIN_LENGTH_USERNAME &&
    username.length <= MAX_LENGTH_USERNAME &&
    /^[a-zA-Z0-9]+$/.test(username);
  if (!valid)
    error.username = `Username length must be between ${MIN_LENGTH_USERNAME} and ${MAX_LENGTH_USERNAME} and do not contain any special characters`;
  return valid;
}

function isValidEmail(email, error = {}) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [localPart, emailDomain] = email.split("@");

  if (
    email.length < MIN_LENGTH_USERNAME ||
    email.length > MAX_LENGTH_USERNAME
  ) {
    error.email = `Email must be between ${MIN_LENGTH_USERNAME} and ${MAX_LENGTH_USERNAME} characters long.`;
    return false;
  }

  if (!emailPattern.test(email)) {
    error.email =
      "Please enter a valid email address (e.g., username@domain.com).";
    return false;
  }

  if (!ACCEPTABLE_EMAIL_DOMAIN.includes(emailDomain.toLowerCase())) {
    const emailDomainAcceptableStr = ACCEPTABLE_EMAIL_DOMAIN.join(", ");
    error.email = `We currently do not support your email domain! Please use ${emailDomainAcceptableStr} accounts to sign up!`;
    return false;
  }

  return true;
}

function isValidPassword(password, error = {}) {
  const isValidLength =
    password.length >= MIN_LENGTH_PASSWORD &&
    password.length <= MAX_LENGTH_PASSWORD;
  const containsUppercase = /[A-Z]/.test(password);
  const containsLowercase = /[a-z]/.test(password);
  const containsNumber = /[0-9]/.test(password);
  const containsSpecialCharacter = /[~!@#$%^&*()_]/.test(password);

  const valid =
    isValidLength &&
    containsUppercase &&
    containsLowercase &&
    containsNumber &&
    containsSpecialCharacter;

  if (!error.password) error.password = [];
  if (!isValidLength)
    error.password.push(
      `Password must be between ${MIN_LENGTH_PASSWORD} and ${MAX_LENGTH_PASSWORD} characters long.`
    );
  if (!containsUppercase)
    error.password.push("Password must contain at least one uppercase letter.");
  if (!containsLowercase)
    error.password.push("Password must contain at least one lowercase letter.");
  if (!containsNumber)
    error.password.push("Password must contain at least one number.");
  if (!containsSpecialCharacter)
    error.password.push(
      "Password must contain at least one special character (~!@#$%^&*()_)."
    );

  return valid;
}

function isValidConfirmedPassword(password, confirmPassword, error = {}) {
  if (password !== confirmPassword)
    error.confirmPassword =
      "Your confirmed password does not match your password";
  return password === confirmPassword;
}

function createErrorSection(error) {
  const errorDiv = document.createElement("div");
  for (let err of Object.keys(error)) {
    if (Array.isArray(error[err])) {
      for (let e of error[err]) {
        const p = document.createElement("p");
        p.innerText = e;
        errorDiv.appendChild(p);
      }
    } else {
      const p = document.createElement("p");
      p.innerText = error[err];
      errorDiv.appendChild(p);
    }
  }
  return errorDiv;
}
