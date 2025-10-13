import React, { useState, useEffect } from 'react';
import { MapPin, Upload, ThumbsUp, MessageCircle, Sun, Moon, Globe, User, LogOut, Home, PlusCircle, Search } from 'lucide-react';

const CivicIssueApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');

  const translations = {
    en: {
      appName: 'Civic Voice',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      welcome: 'Welcome to Civic Voice',
      subtitle: 'Report civic issues, make your community better',
      reportIssue: 'Report Issue',
      feed: 'Community Feed',
      logout: 'Logout',
      newIssue: 'Report New Issue',
      issueTitle: 'Issue Title',
      description: 'Description',
      uploadImage: 'Upload Image',
      submit: 'Submit',
      anonymous: 'Posted anonymously',
      upvote: 'Upvote',
      comment: 'Comment',
      addComment: 'Add a comment...',
      send: 'Send',
      pending: 'Pending',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      search: 'Search issues...'
    },
    hi: {
      appName: 'नागरिक आवाज',
      login: 'लॉगिन',
      signup: 'साइन अप',
      email: 'ईमेल',
      password: 'पासवर्ड',
      name: 'नाम',
      welcome: 'नागरिक आवाज में आपका स्वागत है',
      subtitle: 'नागरिक समस्याओं की रिपोर्ट करें, अपने समुदाय को बेहतर बनाएं',
      reportIssue: 'समस्या रिपोर्ट करें',
      feed: 'समुदाय फ़ीड',
      logout: 'लॉगआउट',
      newIssue: 'नई समस्या रिपोर्ट करें',
      issueTitle: 'समस्या शीर्षक',
      description: 'विवरण',
      uploadImage: 'छवि अपलोड करें',
      submit: 'जमा करें',
      anonymous: 'गुमनाम रूप से पोस्ट किया गया',
      upvote: 'अपवोट',
      comment: 'टिप्पणी',
      addComment: 'एक टिप्पणी जोड़ें...',
      send: 'भेजें',
      pending: 'लंबित',
      inProgress: 'प्रगति में',
      resolved: 'हल हो गया',
      search: 'समस्याएं खोजें...'
    },
    mr: {
      appName: 'नागरिक आवाज',
      login: 'लॉगिन',
      signup: 'साइन अप',
      email: 'ईमेल',
      password: 'पासवर्ड',
      name: 'नाव',
      welcome: 'नागरिक आवाजमध्ये आपले स्वागत आहे',
      subtitle: 'नागरी समस्यांचा अहवाल द्या, आपला समुदाय चांगला करा',
      reportIssue: 'समस्या अहवाल द्या',
      feed: 'समुदाय फीड',
      logout: 'लॉगआउट',
      newIssue: 'नवीन समस्या अहवाल द्या',
      issueTitle: 'समस्या शीर्षक',
      description: 'वर्णन',
      uploadImage: 'प्रतिमा अपलोड करा',
      submit: 'सबमिट करा',
      anonymous: 'अनामिकपणे पोस्ट केले',
      upvote: 'अपवोट',
      comment: 'टिप्पणी',
      addComment: 'टिप्पणी जोडा...',
      send: 'पाठवा',
      pending: 'प्रलंबित',
      inProgress: 'प्रगतीपथावर',
      resolved: 'निराकरण झाले',
      search: 'समस्या शोधा...'
    }
  };

  const t = translations[language];

  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: 'Broken streetlight on MG Road',
        description: 'The streetlight has been non-functional for 2 weeks causing safety issues',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
        location: 'MG Road, Nashik',
        status: 'pending',
        upvotes: 24,
        comments: [
          { id: 1, text: 'I have the same issue in my area', user: 'Anonymous User' }
        ],
        createdAt: '2 days ago'
      },
      {
        id: 2,
        title: 'Pothole on Highway',
        description: 'Large pothole causing accidents, needs immediate attention',
        image: 'https://images.unsplash.com/photo-1625935214533-8c5fc8d19294?w=400',
        location: 'Mumbai-Nashik Highway',
        status: 'inProgress',
        upvotes: 56,
        comments: [],
        createdAt: '5 days ago'
      },
      {
        id: 3,
        title: 'Garbage accumulation near park',
        description: 'Garbage not collected for days, creating health hazards',
        image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
        location: 'Gandhi Nagar Park',
        status: 'resolved',
        upvotes: 89,
        comments: [
          { id: 1, text: 'Great work! Issue resolved', user: 'Anonymous User' },
          { id: 2, text: 'Thank you authorities', user: 'Anonymous User' }
        ],
        createdAt: '1 week ago'
      }
    ];
    setPosts(mockPosts);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-red-500';
      case 'inProgress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return t.pending;
      case 'inProgress': return t.inProgress;
      case 'resolved': return t.resolved;
      default: return status;
    }
  };

  const handleLogin = () => {
    setCurrentUser({ id: Date.now(), name: 'Anonymous User' });
    setIsLoggedIn(true);
    setCurrentPage('feed');
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleSignup = () => {
    setCurrentUser({ id: Date.now(), name: 'Anonymous User' });
    setIsLoggedIn(true);
    setCurrentPage('feed');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleUpvote = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
    ));
  };

  const handleComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    setPosts(posts.map(post => 
      post.id === postId ? {
        ...post,
        comments: [...post.comments, { id: Date.now(), text: commentText, user: 'Anonymous User' }]
      } : post
    ));
  };

  const handleNewPost = () => {
    if (!newIssueTitle.trim() || !newIssueDesc.trim()) return;
    const newPost = {
      id: Date.now(),
      title: newIssueTitle,
      description: newIssueDesc,
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
      location: 'Nashik, Maharashtra',
      status: 'pending',
      upvotes: 0,
      comments: [],
      createdAt: 'Just now'
    };
    setPosts([newPost, ...posts]);
    setNewIssueTitle('');
    setNewIssueDesc('');
    setCurrentPage('feed');
  };

  const HomePage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-16">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t.appName}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-lg`}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h2 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {t.welcome}
          </h2>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            {t.subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg"
            >
              {t.login}
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-indigo-600 hover:bg-gray-50'}`}
            >
              {t.signup}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: MapPin, title: 'Location Based', desc: 'Automatic location detection' },
            { icon: User, title: 'Anonymous', desc: 'Your identity stays private' },
            { icon: MessageCircle, title: 'Community', desc: 'Engage with others' }
          ].map((feature, idx) => (
            <div key={idx} className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <feature.icon className={`w-12 h-12 mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const LoginPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center px-4`}>
      <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.login}</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder={t.email}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <input
            type="password"
            placeholder={t.password}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <button onClick={handleLogin} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all">
            {t.login}
          </button>
        </div>
        <button onClick={() => setCurrentPage('home')} className={`mt-4 w-full py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:underline`}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const SignupPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center px-4`}>
      <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.signup}</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t.name}
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <input
            type="email"
            placeholder={t.email}
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <input
            type="password"
            placeholder={t.password}
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <button onClick={handleSignup} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all">
            {t.signup}
          </button>
        </div>
        <button onClick={() => setCurrentPage('home')} className={`mt-4 w-full py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'} hover:underline`}>
          Back to Home
        </button>
      </div>
    </div>
  );

  const NewIssuePage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.newIssue}</h2>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-4`}>
          <input
            type="text"
            placeholder={t.issueTitle}
            value={newIssueTitle}
            onChange={(e) => setNewIssueTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <textarea
            placeholder={t.description}
            value={newIssueDesc}
            onChange={(e) => setNewIssueDesc(e.target.value)}
            rows="4"
            className={`w-full px-4 py-3 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          />
          <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
            <Upload className={`mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={32} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t.uploadImage}</p>
          </div>
          <div className={`flex items-center gap-2 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <MapPin className={isDark ? 'text-indigo-400' : 'text-indigo-600'} size={20} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Nashik, Maharashtra</span>
          </div>
          <button onClick={handleNewPost} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all">
            {t.submit}
          </button>
        </div>
      </div>
    </div>
  );

  const FeedPage = () => (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
            <input
              type="text"
              placeholder={t.search}
              className={`w-full pl-10 pr-4 py-3 rounded-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className={`rounded-xl overflow-hidden shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{post.createdAt}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{post.title}</h3>
                <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{post.description}</p>
                <div className={`flex items-center gap-2 mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MapPin size={16} />
                  <span>{post.location}</span>
                </div>
                <div className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.anonymous}</div>
                
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <ThumbsUp size={18} />
                    <span className={isDark ? 'text-white' : 'text-gray-800'}>{post.upvotes}</span>
                  </button>
                  <button
                    onClick={() => setShowComments({...showComments, [post.id]: !showComments[post.id]})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <MessageCircle size={18} />
                    <span className={isDark ? 'text-white' : 'text-gray-800'}>{post.comments.length}</span>
                  </button>
                </div>

                {showComments[post.id] && (
                  <div className={`border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    {post.comments.map(comment => (
                      <div key={comment.id} className={`mb-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{comment.user}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{comment.text}</p>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        placeholder={t.addComment}
                        className={`flex-1 px-3 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(post.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          handleComment(post.id, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        {t.send}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Navbar = () => (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.appName}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('feed')}
            className={`p-2 rounded-lg ${currentPage === 'feed' ? 'bg-indigo-600 text-white' : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => setCurrentPage('newIssue')}
            className={`p-2 rounded-lg ${currentPage === 'newIssue' ? 'bg-indigo-600 text-white' : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-3 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
          >
            <option value="en">EN</option>
            <option value="hi">हि</option>
            <option value="mr">मर</option>
          </select>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setCurrentPage('home');
            }}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div>
      {!isLoggedIn && currentPage === 'home' && <HomePage />}
      {!isLoggedIn && currentPage === 'login' && <LoginPage />}
      {!isLoggedIn && currentPage === 'signup' && <SignupPage />}
      {isLoggedIn && currentPage === 'feed' && <FeedPage />}
      {isLoggedIn && currentPage === 'newIssue' && <NewIssuePage />}
    </div>
  );
};

export default CivicIssueApp;