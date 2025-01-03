const logoutBtn = document.querySelector("li .logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/users/logout`; // Form the logout URL
      let response = await fetch(url, {
        method: "POST",
      });

      if (response.ok) {
        successRequestNotification("Succesfully Log out");
        setTimeout(() => {
          window.location.reload(); // Reload the page
        }, 1500);
      } else {
        failureRequestNotification("Failed to log out.");
      }
    } catch (error) {
      failureRequestNotification(error.message);
    }
  });
}

const favBtn = document.querySelector(".fav-button");
favBtn &&
  favBtn.addEventListener("click", async (e) => {
    try {
      const baseUrl = window.location.origin;
      const id = e.target.id;
      const url = `${baseUrl}/users/fav`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), //
      });

      if (response.ok) {
        const data = await response.json();
        successRequestNotification(data.message);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        // If login failed, handle the error (e.g., show error message)
        const error = await response.json();
        failureRequestNotification("Action failed:" + error.message);
      }
    } catch (err) {
      failureRequestNotification("Action failed:" + err.message);
    }
  });
