// complaints.js - Loads and displays complaints on timeline

const userEmail = localStorage.getItem('userEmail') || 'anonymous@user.com';

// Status color mapping
const statusColors = {
  'unsolved': '#ef4444',      // Red
  'in-progress': '#f59e0b',   // Yellow/Orange
  'solved': '#10b981'         // Green
};

const statusIcons = {
  'unsolved': '🔴',
  'in-progress': '🟡',
  'solved': '🟢'
};

// Load all complaints on page load
async function loadComplaints() {
  try {
    const response = await fetch('http://localhost:5000/reports');
    const reports = await response.json();
    
    displayComplaints(reports);
  } catch (error) {
    console.error('Error loading complaints:', error);
    showError('Failed to load complaints. Make sure the server is running.');
  }
}

// Load nearby complaints based on user location
async function loadNearbyComplaints(lat, lng, radius = 5) {
  try {
    const response = await fetch(`http://localhost:5000/nearbyReports?lat=${lat}&lng=${lng}&radius=${radius}`);
    const reports = await response.json();
    
    displayComplaints(reports);
  } catch (error) {
    console.error('Error loading nearby complaints:', error);
    showError('Failed to load nearby complaints.');
  }
}

// Display complaints in the feed
function displayComplaints(reports) {
  const container = document.getElementById('postsContainer') || 
                    document.getElementById('complaint-container') || 
                    document.querySelector('.main-content');
  
  if (!container) {
    console.error('No container found for complaints');
    return;
  }

  if (reports.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p style="font-size: 18px;">No complaints found in your area yet.</p>
        <p>Be the first to report an issue!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reports.map(report => createComplaintCard(report)).join('');
  
  // Attach event listeners after rendering
  attachComplaintEventListeners();
}

// Create HTML for a single complaint card
function createComplaintCard(report) {
  const statusColor = statusColors[report.status];
  const statusIcon = statusIcons[report.status];
  const timeAgo = getTimeAgo(report.createdAt);
  const imageUrl = report.image ? `http://localhost:5000/uploads/${report.image}` : 'https://via.placeholder.com/400x250?text=No+Image';
  
  const categoryIcons = {
    'roads': '🛣️',
    'garbage': '🗑️',
    'water': '💧',
    'electricity': '⚡'
  };

  return `
    <div class="complaint-card" data-id="${report._id}" style="border-left: 5px solid ${statusColor};">
      <div class="complaint-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">${categoryIcons[report.category] || '📋'}</span>
          <span style="font-weight: 600; font-size: 14px; text-transform: uppercase; color: #666;">${report.category}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;" title="${report.status}">${statusIcon}</span>
          <span style="font-size: 12px; color: #888;">${timeAgo}</span>
        </div>
      </div>

      <img src="${imageUrl}" alt="${report.title}" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Not+Found'">
      
      <div class="details">
        <h3 style="margin: 10px 0; font-size: 18px;">${escapeHtml(report.title)}</h3>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">${escapeHtml(report.description)}</p>
        
        ${report.latitude && report.longitude ? `
          <div style="margin-top: 8px; font-size: 12px; color: #888;">
            📍 Location: ${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}
            <a href="https://www.google.com/maps?q=${report.latitude},${report.longitude}" 
               target="_blank" 
               style="color: #007bff; margin-left: 8px;">
              View on Map
            </a>
          </div>
        ` : ''}

        <div class="action-buttons" style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="vote-btn" data-id="${report._id}" style="background: ${report.votedBy.includes(userEmail) ? '#888' : '#2ecc71'};">
            <i class="fas fa-arrow-up"></i> 
            <span class="vote-count">${report.votes}</span> 
            ${report.votedBy.includes(userEmail) ? 'Voted' : 'Upvote'}
          </button>
          
          <button class="vote-btn comment" onclick="toggleComments('${report._id}')" style="background-color: #3498db;">
            <i class="fas fa-comment"></i> 
            ${report.comments.length} Comments
          </button>
          
          <button class="vote-btn share" onclick="shareComplaint('${report._id}')" style="background-color: #e67e22;">
            <i class="fas fa-share"></i> Share
          </button>

          ${report.escalated ? `
            <span style="background: #f39c12; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">
              ⚠️ ESCALATED
            </span>
          ` : ''}
        </div>

        <!-- Comments Section -->
        <div class="comments-section" id="comments-${report._id}" style="display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee;">
          <div class="comments-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 12px;">
            ${report.comments.map(comment => `
              <div style="background: #f5f5f5; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px;">
                <div style="font-size: 12px; color: #888; margin-bottom: 4px;">
                  👤 ${comment.userEmail.split('@')[0]} • ${getTimeAgo(comment.createdAt)}
                </div>
                <div style="font-size: 14px;">${escapeHtml(comment.text)}</div>
              </div>
            `).join('') || '<p style="color: #888; text-align: center;">No comments yet. Be the first!</p>'}
          </div>
          
          <div style="display: flex; gap: 8px;">
            <input type="text" 
                   class="comment-input" 
                   id="comment-input-${report._id}" 
                   placeholder="Add a comment..."
                   style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px;">
            <button onclick="addComment('${report._id}')" 
                    style="background: #2ecc71; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Attach event listeners to vote buttons
function attachComplaintEventListeners() {
  document.querySelectorAll('.vote-btn').forEach(btn => {
    if (!btn.classList.contains('comment') && !btn.classList.contains('share')) {
      btn.addEventListener('click', function() {
        const reportId = this.getAttribute('data-id');
        voteOnComplaint(reportId, this);
      });
    }
  });
}

// Vote on a complaint
async function voteOnComplaint(reportId, buttonElement) {
  try {
    const response = await fetch(`http://localhost:5000/vote/${reportId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });

    const data = await response.json();

    if (response.ok) {
      // Update vote count
      const voteCountElement = buttonElement.querySelector('.vote-count');
      voteCountElement.textContent = data.votes;
      
      // Disable button and change style
      buttonElement.style.background = '#888';
      buttonElement.innerHTML = `<i class="fas fa-check"></i> <span class="vote-count">${data.votes}</span> Voted`;
      buttonElement.disabled = true;

      if (data.escalated) {
        alert('✅ This complaint has been escalated to authorities!');
        // Reload to show escalation badge
        loadComplaints();
      }
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Vote error:', error);
    alert('Failed to vote. Please try again.');
  }
}

// Toggle comments section
function toggleComments(reportId) {
  const commentsSection = document.getElementById(`comments-${reportId}`);
  if (commentsSection.style.display === 'none') {
    commentsSection.style.display = 'block';
  } else {
    commentsSection.style.display = 'none';
  }
}

// Add a comment
async function addComment(reportId) {
  const inputElement = document.getElementById(`comment-input-${reportId}`);
  const text = inputElement.value.trim();

  if (!text) {
    alert('Please enter a comment');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/comment/${reportId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, text })
    });

    const data = await response.json();

    if (response.ok) {
      inputElement.value = '';
      // Reload complaints to show new comment
      loadComplaints();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Comment error:', error);
    alert('Failed to add comment. Please try again.');
  }
}

// Share complaint
function shareComplaint(reportId) {
  const shareUrl = `${window.location.origin}/complaint.html?id=${reportId}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Civic Complaint',
      text: 'Check out this complaint on Speak for the Streets',
      url: shareUrl
    }).catch(err => console.log('Share failed:', err));
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Copy failed:', err);
      alert('Share link: ' + shareUrl);
    });
  }
}

// Search complaints
async function searchComplaints(query) {
  if (!query.trim()) {
    loadComplaints();
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(query)}`);
    const reports = await response.json();
    displayComplaints(reports);
  } catch (error) {
    console.error('Search error:', error);
    showError('Search failed. Please try again.');
  }
}

// Utility: Get time ago string
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show error message
function showError(message) {
  const container = document.getElementById('postsContainer') || 
                    document.getElementById('complaint-container') || 
                    document.querySelector('.main-content');
  
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #e74c3c;">
        <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p style="font-size: 18px;">${message}</p>
      </div>
    `;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Try to get user location and load nearby complaints
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        loadNearbyComplaints(lat, lng, 10); // 10km radius
      },
      (error) => {
        console.log('Location access denied, loading all complaints');
        loadComplaints();
      }
    );
  } else {
    loadComplaints();
  }

  // Setup search functionality
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('sidebarSearchInput');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      searchComplaints(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchComplaints(searchInput.value);
      }
    });
  }
});

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
  window.loadComplaints = loadComplaints;
  window.loadNearbyComplaints = loadNearbyComplaints;
  window.toggleComments = toggleComments;
  window.addComment = addComment;
  window.shareComplaint = shareComplaint;
  window.searchComplaints = searchComplaints;
}
