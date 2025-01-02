const logoutBtn = document.querySelector("li .logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/users/logout`; // Form the logout URL
      console.log(url);
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
