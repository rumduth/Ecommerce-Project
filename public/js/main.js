const filterBtn = document.getElementById("filterBtn");
const types = document.querySelectorAll(".types input");
const brands = document.querySelectorAll(".brands input");
const prevBtn = document.querySelector(".prev-button");
const nextBtn = document.querySelector(".next-button");
const logoutBtn = document.querySelector("li .logout");

filterBtn.addEventListener("click", () => {
  let searchTypes = [];

  let brandTypes = [];

  // Collect selected checkboxes
  types.forEach((type) => {
    if (type.checked) searchTypes.push(type.value);
  });

  brands.forEach((brand) => {
    if (brand.checked) brandTypes.push(brand.value);
  });

  const currentUrl = new URL("/products", location.origin);

  // Update query parameters
  if (brandTypes.length > 0) {
    currentUrl.searchParams.set("brand", brandTypes.join(";"));
  }

  if (searchTypes.length > 0) {
    currentUrl.searchParams.set("type", searchTypes.join(";"));
  }

  // Reload the page with the updated URL
  window.location.href = currentUrl.toString();
});

nextBtn.addEventListener("click", async () => {
  const urlParams = new URLSearchParams(window.location.search); // Get current query string
  const currentPage = parseInt(urlParams.get("page") || 1);
  urlParams.set("page", currentPage + 1); // Increment the page

  // Construct the new URL by changing the path and keeping the query string
  const newUrl = "/products?" + urlParams.toString();

  // Update the browser URL and reload the page
  window.location.href = newUrl; // This will reload the page with the new URL
});

prevBtn.addEventListener("click", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page") || 1);

  // Prevent going to a page before 1
  if (currentPage <= 1) return; // Disable navigation if already on page 1

  urlParams.set("page", currentPage - 1); // Decrement the page
  window.location.search = urlParams.toString(); // This reloads the page with the new query parameter
});

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

document.querySelector(".grid").addEventListener("click", async (e) => {
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

    // Check if the login was successful
    if (response.ok) {
      const data = await response.json();
      successRequestNotification(data.message);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      // If login failed, handle the error (e.g., show error message)
      const error = await response.json();
      // failureRequestNotification("Action failed:" + error.message);
    }
  } catch (err) {
    // failureRequestNotification("Action failed:" + err.message);
  }
});
let favoriteSidebar = document.querySelector(".favorite-sidebar");
favoriteSidebar &&
  favoriteSidebar.addEventListener("click", async (e) => {
    try {
      const baseUrl = window.location.origin;
      if (e.target.id === "clearFavorites") return;
      const id = e.target.id;
      const url = `${baseUrl}/users/fav`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), //
      });

      // Check if the login was successful

      if (response.ok) {
        const data = await response.json();
        successRequestNotification(data.message);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        // If login failed, handle the error (e.g., show error message)
        const error = await response.json();
        // failureRequestNotification("Action failed:" + error.message);
      }
    } catch (err) {
      // failureRequestNotification("Action failed:" + err.message);
    }
  });

let clearFavorite = document.querySelector("#clearFavorites");
clearFavorite &&
  clearFavorite.addEventListener("click", async (e) => {
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/users/delete-all-fav`;
      const response = await fetch(url, {
        method: "POST",
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        successRequestNotification(data.message);
        setTimeout(() => window.location.reload(), 500);
      } else {
        // Handle failed request
        const error = await response.json();
        // failureRequestNotification("Action failed" + error.message);
      }
    } catch (err) {
      // failureRequestNotification("Action failed 2" + err.message);
    }
  });
