const form = document.querySelector("form");

async function createUser() {}

async function handleSignUp(e) {
  e.preventDefault();
  let errSection = document.querySelector("#errSection");
  errSection && errSection.remove();
  let error = {};
  const formData = new FormData(form);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  let validUsername = isValidUsername(username, error);
  let validEmail = isValidEmail(email, error);
  let validPassword = isValidPassword(password, error);
  let validConfirmedPassword = isValidConfirmedPassword(
    password,
    confirmPassword,
    error
  );
  if (validUsername && validEmail && validPassword && validConfirmedPassword) {
    createUser(username, email, password, confirmPassword);
  } else {
    let errDiv = createErrorSection(error);
    errDiv.id = "errSection";
    form.appendChild(errDiv);
  }
}

form.addEventListener("submit", handleSignUp);
