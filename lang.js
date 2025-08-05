const translations = {
  en: {
    issue_submitted_title: "Issue Submitted",
    issue_submitted_heading: "Issue Submitted Successfully",
    issue_submitted_msg: "Thank you for reporting this issue in your locality. Your voice matters! Others can now see your post, vote on it, and leave comments. Once the complaint receives 10 or more votes, it will be automatically forwarded to the relevant municipal authority.",
    view_issues: "🌍 View All Issues",
    post_another: "➕ Post Another"
  },
  hi: {
    issue_submitted_title: "समस्या सबमिट की गई",
    issue_submitted_heading: "समस्या सफलतापूर्वक सबमिट की गई",
    issue_submitted_msg: "अपने क्षेत्र की समस्या को रिपोर्ट करने के लिए धन्यवाद। आपकी आवाज़ महत्वपूर्ण है! अब अन्य लोग आपकी पोस्ट देख सकते हैं, वोट कर सकते हैं और टिप्पणियां कर सकते हैं। एक बार जब शिकायत को 10 या अधिक वोट मिल जाते हैं, तो इसे संबंधित नगरपालिका को स्वचालित रूप से भेज दिया जाएगा।",
    view_issues: "🌍 सभी समस्याएं देखें",
    post_another: "➕ एक और पोस्ट करें"
  },
  mr: {
    issue_submitted_title: "समस्या सबमिट केली",
    issue_submitted_heading: "समस्या यशस्वीरित्या सबमिट झाली",
    issue_submitted_msg: "आपल्या परिसरातील समस्या नोंदवल्याबद्दल धन्यवाद. तुमचा आवाज महत्त्वाचा आहे! आता इतर लोक तुमची पोस्ट पाहू शकतात, मत देऊ शकतात आणि टिप्पण्या करू शकतात. एकदा तक्रारीला 10 किंवा अधिक मते मिळाल्यास, ती संबंधित महापालिकेला स्वयंचलितपणे पाठवली जाईल.",
    view_issues: "🌍 सर्व समस्या पाहा",
    post_another: "➕ पुन्हा एक पोस्ट करा"
  }
};

const langSelect = document.getElementById('langSelect');

langSelect.addEventListener('change', (e) => {
  const lang = e.target.value;
  localStorage.setItem('lang', lang);
  loadLanguage(lang);
});

function loadLanguage(lang) {
  const langData = translations[lang] || translations['en'];
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (langData[key]) el.innerText = langData[key];
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const storedLang = localStorage.getItem('lang') || 'en';
  langSelect.value = storedLang;
  loadLanguage(storedLang);
});
