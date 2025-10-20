document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Frontend validation
    if (!name || !email || !password || !confirmPassword) {
      return showMessage("Please fill in all fields", "red");
    }

    if (password !== confirmPassword) {
      return showMessage("Passwords do not match", "red");
    }

    if (password.length < 6) {
      return showMessage("Password must be at least 6 characters", "red");
    }

    try {
      // Send data to backend
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("Signup successful! Redirecting...", "green");
        form.reset();

        // Redirect after a short delay (optional)
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } else {
        showMessage(data.message || "Signup failed. Try again.", "red");
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("Server error. Please try again later.", "red");
    }
  });

  // Helper function to show messages
  function showMessage(msg, color) {
    message.textContent = msg;
    message.style.color = color;
  }
});
