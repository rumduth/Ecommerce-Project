const form = document.querySelector("form");

async function signInUser(username, password) {}

async function handleSignIn(e) {
  e.preventDefault();
  let errSection = document.querySelector("#errSection");
  errSection && errSection.remove();
  const formData = new FormData(form);
  const username = formData.get("username");
  const password = formData.get("password");
  const validUsername = isValidUsername(username);
  const validEmail = isValidEmail(username);
  const validPassword = isValidPassword(password);
  const signInError = {};
  if (!validUsername && !validEmail)
    signInError.username = "Invalid username or email";
  if (!validPassword) signInError.password = "Invalid Password";
  if (validPassword && (validPassword || validEmail)) {
    signInUser(username, password);
  } else {
    let errDiv = createErrorSection(signInError);
    errDiv.id = "errSection";
    form.appendChild(errDiv);
  }
}

form.addEventListener("submit", handleSignIn);
