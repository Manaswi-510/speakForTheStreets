const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  const email = form.username.value;  
  const password = form.password.value;

  try {
    const response = await fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), 
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
      window.location.href = "main.html";
    }
  } catch (error) {
    alert("Signin failed. Please try again.");
  }
});


