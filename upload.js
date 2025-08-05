document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const status = document.getElementById("uploadStatus");
  status.innerText = "📤 Uploading...";

  fetch("/upload", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        status.innerText = "✅ Complaint submitted successfully!";
        this.reset();
      } else {
        status.innerText = "❌ Failed to upload complaint. Please try again.";
      }
    })
    .catch(() => {
      status.innerText = "⚠️ Network error. Try again.";
    });
});
