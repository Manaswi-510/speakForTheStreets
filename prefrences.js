// preferences.js - Manages user preferences (language, theme, location)

// Check if user is logged in
function checkAuth() {
  const userEmail = localStorage.getItem('userEmail');
  
  if (!userEmail && window.location.pathname.includes('main.html') || 
      window.location.pathname.includes('create.html') || 
      window.location.pathname.includes('profile.html')) {
    alert('Please login first!');
    window.location.href = 'index.html';
  }
  
  return userEmail;
}

// Save user session after login
function saveUserSession(email, fullname) {
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userFullname', fullname || 'Anonymous');
  localStorage.setItem('loginTime', new Date().toISOString());
}

// Clear user session on logout
function clearUserSession() {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userFullname');
  localStorage.removeItem('loginTime');
}

// Get current user
function getCurrentUser() {
  return {
    email: localStorage.getItem('userEmail'),
    fullname: localStorage.getItem('userFullname') || 'Anonymous'
  };
}

// Language Management
const languagePreferences = {
  save: (lang) => {
    localStorage.setItem('preferredLanguage', lang);
  },
  
  get: () => {
    return localStorage.getItem('preferredLanguage') || 'en';
  },
  
  load: () => {
    const saved = languagePreferences.get();
    const selector = document.getElementById('langSelect');
    if (selector) {
      selector.value = saved;
    }
    return saved;
  }
};

// Theme Management (Dark/Light Mode)
const themePreferences = {
  save: (isDark) => {
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  },
  
  get: () => {
    return localStorage.getItem('darkMode') === 'true';
  },
  
  apply: () => {
    const isDark = themePreferences.get();
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Update toggle checkbox if exists
    const toggle = document.getElementById('darkToggle');
    if (toggle) {
      toggle.checked = isDark;
    }
  },
  
  toggle: () => {
    const isDark = !themePreferences.get();
    themePreferences.save(isDark);
    themePreferences.apply();
  }
};

// Location Management
const locationPreferences = {
  save: (lat, lng, city, country) => {
    localStorage.setItem('userLat', lat);
    localStorage.setItem('userLng', lng);
    localStorage.setItem('userCity', city || '');
    localStorage.setItem('userCountry', country || '');
    localStorage.setItem('locationTime', new Date().toISOString());
  },
  
  get: () => {
    return {
      lat: parseFloat(localStorage.getItem('userLat')) || null,
      lng: parseFloat(localStorage.getItem('userLng')) || null,
      city: localStorage.getItem('userCity') || '',
      country: localStorage.getItem('userCountry') || '',
      time: localStorage.getItem('locationTime')
    };
  },
  
  clear: () => {
    localStorage.removeItem('userLat');
    localStorage.removeItem('userLng');
    localStorage.removeItem('userCity');
    localStorage.removeItem('userCountry');
    localStorage.removeItem('locationTime');
  },
  
  isStale: () => {
    const time = localStorage.getItem('locationTime');
    if (!time) return true;
    
    const savedTime = new Date(time);
    const now = new Date();
    const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
    
    // Location is stale if older than 6 hours
    return hoursDiff > 6;
  }
};

// Get user location with caching
async function getUserLocation(forceRefresh = false) {
  // Check cached location first
  if (!forceRefresh && !locationPreferences.isStale()) {
    const cached = locationPreferences.get();
    if (cached.lat && cached.lng) {
      return cached;
    }
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Get city name using reverse geocoding
        try {
          const apiKey = "a98b355f15554a5c90f82ac04fd37da0";
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
          );
          const data = await response.json();
          
          const city = data.results[0].components.city || 
                      data.results[0].components.town || 
                      data.results[0].components.village || 
                      "Unknown city";
          const country = data.results[0].components.country || "Unknown country";
          
          // Save to cache
          locationPreferences.save(lat, lng, city, country);
          
          // Update UI
          updateLocationDisplay(city, country);
          
          resolve({ lat, lng, city, country });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          locationPreferences.save(lat, lng, '', '');
          resolve({ lat, lng, city: '', country: '' });
        }
      },
      (error) => {
        console.error('Location error:', error);
        reject(error);
      }
    );
  });
}

// Update location display in UI
function updateLocationDisplay(city, country) {
  const locationElements = document.querySelectorAll('#locationText, #location');
  locationElements.forEach(el => {
    if (el) {
      el.textContent = `📍 ${city}, ${country}`;
    }
  });
}

// Notification preferences
const notificationPreferences = {
  save: (enabled) => {
    localStorage.setItem('notificationsEnabled', enabled ? 'true' : 'false');
  },
  
  get: () => {
    return localStorage.getItem('notificationsEnabled') !== 'false'; // Default true
  }
};

// Initialize preferences on page load
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme
  themePreferences.apply();
  
  // Load saved language
  const savedLang = languagePreferences.load();
  
  // Try to get user location
  getUserLocation().then(location => {
    console.log('User location:', location);
  }).catch(error => {
    console.log('Could not get location:', error);
    // Use default location
    updateLocationDisplay('Pune', 'India');
  });
  
  // Setup dark mode toggle
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    darkToggle.checked = themePreferences.get();
    darkToggle.addEventListener('change', () => {
      themePreferences.toggle();
    });
  }
  
  // Check authentication for protected pages
  const protectedPages = ['main.html', 'create.html', 'profile.html', 'reels.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    const userEmail = checkAuth();
    if (!userEmail) return;
    
    // Display user info
    const user = getCurrentUser();
    const userElements = document.querySelectorAll('.user-name, #userName');
    userElements.forEach(el => {
      if (el) {
        el.textContent = user.fullname;
      }
    });
  }
});

// Export functions for global use
if (typeof window !== 'undefined') {
  window.checkAuth = checkAuth;
  window.saveUserSession = saveUserSession;
  window.clearUserSession = clearUserSession;
  window.getCurrentUser = getCurrentUser;
  window.getUserLocation = getUserLocation;
  window.updateLocationDisplay = updateLocationDisplay;
  window.languagePreferences = languagePreferences;
  window.themePreferences = themePreferences;
  window.locationPreferences = locationPreferences;
  window.notificationPreferences = notificationPreferences;
}