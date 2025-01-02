const form = document.querySelector("form");

async function signInUser(username, password) {
  try {
    // Prepare the data to be sent in the request body
    const data = {
      username: username,
      password: password,
    };
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/users/login`; // Form the logout URL
    // Send the POST request to the server with the user credentials
    const response = await fetch(url, {
      method: "POST", // POST method to authenticate the user
      headers: {
        "Content-Type": "application/json", // Send data as JSON
      },
      body: JSON.stringify(data), // Send the username and password as a JSON string
    });

    // Check if the login was successful
    if (response.ok) {
      successRequestNotification("Succesfully Logged In");
      // Redirect to homepage after login
      setTimeout(() => (window.location.href = "/"), 1500);
    } else {
      // If login failed, handle the error (e.g., show error message)
      const error = await response.json();
      failureRequestNotification("Login failed:" + error.message);
    }
  } catch (error) {
    failureRequestNotification("Login failed:" + error.message);
  }
}

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
