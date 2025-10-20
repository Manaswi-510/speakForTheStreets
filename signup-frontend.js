// Updated signin-frontend.js with proper session management

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.username.value.trim();  
  const password = form.password.value;

  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }

  // Disable submit button during request
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

  try {
    const response = await fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), 
    });

    const data = await response.json();

    if (response.ok) {
      // Save user session
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userFullname', data.fullname || 'Anonymous');
      localStorage.setItem('loginTime', new Date().toISOString());
      
      alert('✅ ' + data.message);
      
      // Redirect to main page
      window.location.href = "main.html";
    } else {
      alert('❌ ' + data.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  } catch (error) {
    console.error('Signin error:', error);
    alert("❌ Signin failed. Please make sure the server is running on http://localhost:5000");
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});
