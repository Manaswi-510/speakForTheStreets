// Enhanced complaints.js with worker features and anonymous comments

const userEmail = localStorage.getItem('userEmail') || 'anonymous@user.com';
const userRole = localStorage.getItem('userRole') || 'citizen';
const userName = localStorage.getItem('userFullname') || 'Anonymous';

// Status color mapping
const statusColors = {
  'unsolved': '#ef4444',
  'in-progress': '#f59e0b',
  'solved': '#10b981'
};

const statusIcons = {
  'unsolved': '🔴',
  'in-progress': '🟡',
  'solved': '🟢'
};

// Load complaints based on user role
async function loadComplaints() {
  try {
    const response = await fetch(`http://localhost:5000/reports?userRole=${userRole}`);
    const reports = await response.json();
    
    displayComplaints(reports);
  } catch (error) {
    console.error('Error loading complaints:', error);
    showError('Failed to load complaints. Make sure the server is running.');
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
        <p style="font-size: 18px;">No complaints found yet.</p>
        <p>Be the first to report an issue!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reports.map(report => createComplaintCard(report)).join('');
  attachComplaintEventListeners();
}

// Enhanced complaints.js with Fund Request feature
// Replace the createComplaintCard function (lines 106-210) with this

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

  const isOwner = report.userEmail === userEmail;
  const isWorker = userRole === 'worker';
  const isAssignedWorker = report.assignedTo === userEmail;
  const canRequestFund = (report.votes >= 10 || report.escalated) && !report.fundRequest?.requested;
  const hasFundRequest = report.fundRequest?.requested;

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
          ${isOwner ? `<button onclick="deleteComplaint('${report._id}')" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;" title="Delete"><i class="fas fa-trash"></i></button>` : ''}
        </div>
      </div>

      <img src="${imageUrl}" alt="${report.title}" onerror="this.src='https://via.placeholder.com/400x250?text=Image+Not+Found'">
      
      <div class="details">
        <h3 style="margin: 10px 0; font-size: 18px;">${escapeHtml(report.title)}</h3>
        <p style="color: #555; font-size: 14px; line-height: 1.5;">${escapeHtml(report.description)}</p>
        
        ${report.issueLatitude && report.issueLongitude ? `
          <div style="margin-top: 8px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 13px; color: #666; margin-bottom: 5px;">
              📍 <strong>Issue Location:</strong> ${report.issueLatitude.toFixed(4)}, ${report.issueLongitude.toFixed(4)}
              ${report.hasGeoTag ? '<span style="color: #28a745; margin-left: 8px;"><i class="fas fa-check-circle"></i> Geo-verified</span>' : ''}
            </div>
            <a href="https://www.google.com/maps?q=${report.issueLatitude},${report.issueLongitude}" 
               target="_blank" 
               style="display: inline-block; color: #007bff; text-decoration: none; font-size: 13px;">
              <i class="fas fa-map-marker-alt"></i> View on Google Maps
            </a>
          </div>
        ` : ''}

        ${report.assignedTo ? `
          <div style="margin-top: 8px; padding: 8px; background: #e8f5e9; border-radius: 6px; font-size: 13px;">
            <i class="fas fa-user-tie" style="color: #4caf50;"></i> Assigned to: <strong>${isAssignedWorker ? 'You' : 'Worker'}</strong>
          </div>
        ` : ''}

        ${hasFundRequest ? `
          <div style="margin-top: 10px; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <i class="fas fa-money-bill-wave" style="font-size: 20px;"></i>
              <strong style="font-size: 15px;">Fund Release Requested</strong>
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
              Status: <strong>${report.fundRequest.status.toUpperCase()}</strong><br>
              Amount: ₹${report.fundRequest.estimatedAmount?.toLocaleString() || 'TBD'}<br>
              Requested: ${new Date(report.fundRequest.requestDate).toLocaleDateString()}
            </div>
            <button onclick="viewFundRequest('${report._id}')" 
                    style="margin-top: 8px; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
              <i class="fas fa-file-pdf"></i> View Details
            </button>
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

          ${canRequestFund && (isWorker || report.votes >= 10) ? `
            <button onclick="openFundRequestModal('${report._id}')" 
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">
              <i class="fas fa-hand-holding-usd"></i> Request Funds
            </button>
          ` : ''}

          ${isWorker && !report.assignedTo ? `
            <button onclick="takeComplaint('${report._id}')" style="background: #9c27b0; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">
              <i class="fas fa-hand-paper"></i> Take This Task
            </button>
          ` : ''}

          ${isWorker && isAssignedWorker ? `
            <div style="display: flex; gap: 8px;">
              <button onclick="updateStatus('${report._id}', 'in-progress')" 
                      style="background: #ff9800; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; ${report.status === 'in-progress' ? 'opacity: 0.5;' : ''}">
                🟡 In Progress
              </button>
              <button onclick="updateStatus('${report._id}', 'solved')" 
                      style="background: #4caf50; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; ${report.status === 'solved' ? 'opacity: 0.5;' : ''}">
                🟢 Mark Solved
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Comments Section -->
        <div class="comments-section" id="comments-${report._id}" style="display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee;">
          <div class="comments-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 12px;">
            ${report.comments.map(comment => `
              <div style="background: #f5f5f5; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px;">
                <div style="font-size: 12px; color: #888; margin-bottom: 4px;">
                  ${comment.isWorker ? '<i class="fas fa-user-tie" style="color: #4caf50;"></i> Worker' : '👤 Anonymous Citizen'} • ${getTimeAgo(comment.createdAt)}
                </div>
                <div style="font-size: 14px;">${escapeHtml(comment.text)}</div>
              </div>
            `).join('') || '<p style="color: #888; text-align: center;">No comments yet. Be the first!</p>'}
          </div>
          
          <div style="display: flex; gap: 8px;">
            <input type="text" 
                   class="comment-input" 
                   id="comment-input-${report._id}" 
                   placeholder="Add a comment (anonymous)..."
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

// Fund Request Modal Functions
function openFundRequestModal(reportId) {
  const modal = document.createElement('div');
  modal.id = 'fundRequestModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 16px; padding: 30px; max-width: 500px; width: 90%;">
      <h2 style="margin-top: 0; color: #333;">
        <i class="fas fa-hand-holding-usd" style="color: #667eea;"></i> 
        Request Fund Release
      </h2>
      
      <form id="fundRequestForm">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Estimated Amount (₹)</label>
          <input type="number" id="estimatedAmount" required 
                 style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;" 
                 placeholder="e.g., 50000">
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 600;">Justification</label>
          <textarea id="justification" required rows="4"
                    style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;"
                    placeholder="Explain why funds are urgently needed for this issue..."></textarea>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button type="submit" 
                  style="flex: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            <i class="fas fa-paper-plane"></i> Submit Request
          </button>
          <button type="button" onclick="closeFundRequestModal()"
                  style="flex: 1; background: #ccc; color: #333; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('fundRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitFundRequest(reportId);
  });
}

function closeFundRequestModal() {
  const modal = document.getElementById('fundRequestModal');
  if (modal) modal.remove();
}

async function submitFundRequest(reportId) {
  const amount = document.getElementById('estimatedAmount').value;
  const justification = document.getElementById('justification').value;
  
  try {
    const response = await fetch(`http://localhost:5000/report/${reportId}/fund-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requesterEmail: userEmail,
        requesterRole: userRole,
        estimatedAmount: parseFloat(amount),
        justification: justification
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      alert('✅ Fund release request submitted successfully!');
      closeFundRequestModal();
      loadComplaints(); // Reload to show updated status
    } else {
      alert('❌ ' + data.message);
    }
  } catch (error) {
    console.error('Fund request error:', error);
    alert('Failed to submit fund request. Please try again.');
  }
}

async function viewFundRequest(reportId) {
  try {
    const response = await fetch(`http://localhost:5000/report/${reportId}/fund-request`);
    const data = await response.json();
    
    if (data.fundRequest) {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;
      
      modal.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <h2 style="margin-top: 0; color: #667eea;">
            <i class="fas fa-file-invoice-dollar"></i> Fund Request Details
          </h2>
          
          <div style="margin-bottom: 15px;">
            <strong>Status:</strong> 
            <span style="padding: 4px 12px; background: ${
              data.fundRequest.status === 'approved' ? '#4caf50' : 
              data.fundRequest.status === 'rejected' ? '#f44336' : '#ff9800'
            }; color: white; border-radius: 12px; font-size: 12px;">
              ${data.fundRequest.status.toUpperCase()}
            </span>
          </div>
          
          <div style="margin-bottom: 10px;">
            <strong>Requested By:</strong> ${data.fundRequest.requestedByRole === 'worker' ? 'Worker' : 'Citizen'}
          </div>
          
          <div style="margin-bottom: 10px;">
            <strong>Estimated Amount:</strong> ₹${data.fundRequest.estimatedAmount?.toLocaleString()}
          </div>
          
          <div style="margin-bottom: 10px;">
            <strong>Request Date:</strong> ${new Date(data.fundRequest.requestDate).toLocaleDateString()}
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Justification:</strong>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 8px; margin-top: 5px;">
              ${data.fundRequest.justification}
            </p>
          </div>
          
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="width: 100%; background: #667eea; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            Close
          </button>
        </div>
      `;
      
      document.body.appendChild(modal);
    }
  } catch (error) {
    console.error('Error fetching fund request:', error);
    alert('Failed to load fund request details');
  }
}

// Export new functions
if (typeof window !== 'undefined') {
  window.openFundRequestModal = openFundRequestModal;
  window.closeFundRequestModal = closeFundRequestModal;
  window.viewFundRequest = viewFundRequest;
}

// Attach event listeners
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

// Vote on complaint
async function voteOnComplaint(reportId, buttonElement) {
  try {
    const response = await fetch(`http://localhost:5000/vote/${reportId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });

    const data = await response.json();

    if (response.ok) {
      const voteCountElement = buttonElement.querySelector('.vote-count');
      voteCountElement.textContent = data.votes;
      
      buttonElement.style.background = '#888';
      buttonElement.innerHTML = `<i class="fas fa-check"></i> <span class="vote-count">${data.votes}</span> Voted`;
      buttonElement.disabled = true;

      if (data.escalated) {
        alert('✅ This complaint has been escalated to authorities!');
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

// Worker takes complaint
async function takeComplaint(reportId) {
  if (!confirm('Are you sure you want to take this task?')) return;

  try {
    const response = await fetch(`http://localhost:5000/report/${reportId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerEmail: userEmail })
    });

    const data = await response.json();

    if (response.ok) {
      alert('✅ Task assigned to you successfully!');
      loadComplaints();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Assign error:', error);
    alert('Failed to assign task. Please try again.');
  }
}

// Update complaint status (workers only)
async function updateStatus(reportId, status) {
  try {
    const response = await fetch(`http://localhost:5000/report/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, workerEmail: userEmail })
    });

    const data = await response.json();

    if (response.ok) {
      alert(`✅ Status updated to: ${status}`);
      loadComplaints();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Status update error:', error);
    alert('Failed to update status. Please try again.');
  }
}

// Delete complaint (owner only)
async function deleteComplaint(reportId) {
  if (!confirm('Are you sure you want to delete this complaint?')) return;

  try {
    const response = await fetch(`http://localhost:5000/report/${reportId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });

    const data = await response.json();

    if (response.ok) {
      alert('✅ Complaint deleted successfully');
      loadComplaints();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete complaint. Please try again.');
  }
}

// Toggle comments
function toggleComments(reportId) {
  const commentsSection = document.getElementById(`comments-${reportId}`);
  if (commentsSection.style.display === 'none') {
    commentsSection.style.display = 'block';
  } else {
    commentsSection.style.display = 'none';
  }
}

// Add comment (anonymous)
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
      body: JSON.stringify({ 
        userEmail, 
        text,
        isWorker: userRole === 'worker'
      })
    });

    const data = await response.json();

    if (response.ok) {
      inputElement.value = '';
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
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('✅ Link copied to clipboard!');
    }).catch(err => {
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

// Utility functions
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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

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
  loadComplaints();

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

// Export functions
if (typeof window !== 'undefined') {
  window.loadComplaints = loadComplaints;
  window.toggleComments = toggleComments;
  window.addComment = addComment;
  window.shareComplaint = shareComplaint;
  window.searchComplaints = searchComplaints;
  window.takeComplaint = takeComplaint;
  window.updateStatus = updateStatus;
  window.deleteComplaint = deleteComplaint;
}

