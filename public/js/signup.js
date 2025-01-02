const form = document.querySelector("form");

async function createUser(username, email, password, confirmPassword) {
  try {
    const baseUrl = window.location.origin; // This gets the base URL, e.g., "http://localhost:3000"
    const url = `${baseUrl}/users/signup`; // Append the path to the base URL

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header
      },
      body: JSON.stringify({ username, email, password, confirmPassword }), // Send the data in the body
    });

    if (response.ok) {
      // Redirect to home page after a slight delay
      successRequestNotification("Succesfuly Sign Up");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      failureRequestNotification("Failed to create user.");
    }
  } catch (error) {
    failureRequestNotification("Failed to create user.");
  }
}

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
