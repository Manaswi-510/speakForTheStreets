// 🔍 Toggle search bar visibility
function toggleSearch() {
  const box = document.getElementById("searchBox");
  box.style.display = box.style.display === "none" ? "inline-block" : "none";
}

// 🔔 Toggle notification panel
function showNotifications() {
  const panel = document.getElementById("notificationPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

// 👤 Toggle user info panel
function toggleUserInfo() {
  const panel = document.getElementById("userPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

// 📍 Detect user location
window.onload = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        document.getElementById("userLocation").innerText = `📍 Your Location: (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
      },
      () => {
        document.getElementById("userLocation").innerText = "📍 Location access denied.";
      }
    );
  } else {
    document.getElementById("userLocation").innerText = "📍 Geolocation not supported.";
  }
};
