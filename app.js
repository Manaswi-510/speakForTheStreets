// -------------------- Language Switcher --------------------
document.getElementById("langSelect").addEventListener("change", function () {
  const selectedLang = this.value;
  localStorage.setItem("language", selectedLang);
  loadLanguage(selectedLang);
});

function loadLanguage(lang) {
  fetch(`/static/translations/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (data[key]) el.innerText = data[key];
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = localStorage.getItem("language") || "en";
  document.getElementById("langSelect").value = defaultLang;
  loadLanguage(defaultLang);
});

// -------------------- Toggle Notification & Profile Panels --------------------
document.getElementById("notificationBtn").addEventListener("click", () => {
  document.getElementById("notificationsPanel").classList.toggle("hidden");
});
document.getElementById("userBtn").addEventListener("click", () => {
  document.getElementById("userPanel").classList.toggle("hidden");
});

// -------------------- Voting System --------------------
document.querySelectorAll(".vote-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    const postId = this.dataset.postId;

    fetch(`/vote/${postId}`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        this.nextElementSibling.innerText = `${data.votes} votes`;
        if (data.escalated) alert("✅ Complaint escalated to authorities!");
      });
  });
});

// -------------------- Comment System --------------------
document.querySelectorAll(".comment-form").forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const postId = this.dataset.postId;
    const comment = this.querySelector("input").value;

    fetch(`/comment/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment })
    })
      .then(res => res.json())
      .then(data => {
        const commentList = document.getElementById(`comments-${postId}`);
        const li = document.createElement("li");
        li.innerText = data.new_comment;
        commentList.appendChild(li);
        this.querySelector("input").value = "";
      });
  });
});
