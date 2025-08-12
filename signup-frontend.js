const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = form.fullname.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, password }),
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.href = "main.html";
    }
  } catch (error) {
    alert("Signup failed. Please try again.");
  }
});
