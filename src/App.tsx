import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [isMainframeAuthenticated, setIsMainframeAuthenticated] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      
      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        return false;
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success) {
        setIsAuthenticated(true);
        setCurrentUser(username);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  const handleMainframeLogin = (password: string) => {
    if (password === 'tempus') {
      setIsMainframeAuthenticated(true);
      return true;
    }
    return false;
  };

  function MainframeRoute() {
    const location = useLocation();
    const state = location.state as { fromProfile?: boolean } | null;
    
    if (state?.fromProfile) {
      return <MainframePage />;
    }
    
    return isMainframeAuthenticated ? 
      <MainframePage /> : 
      <MainframeLogin onLogin={handleMainframeLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <div className="ascii-art">
          {` ____________________________  
\\  _____________________  / 
 \\ \\                   / /  
  \\ \\                 / /                 
   \\ \\__,;--'''--;,__/ /
    \\     _..-.._     /
    :  \\           /  :
   : /\\ \\         / /\\ :
  : /  \\ \\       / /  \\ :
 : /    \\ \\     / /    \\ :  
 : \\    / /     \\ \\    / :
  : \\  / /       \\ \\  / :
   : \\/ /         \\ \\/ :
    :  /           \\  :
   /  .   -.._..-   .  \\
  /  /  ':--,,,--:'  \\  \\
 /  /                 \\  \\
/  /___________________\\  \\ 
/___________________________\\`}
        </div>
        <div className="welcome-text">
          <p>Welcome to the home of the institute for Chrononautics, Exploration, and Discovery.</p>
          <p>This site is restricted to Field Agents and prospective Field Agents only.</p>
        </div>
        <nav className="top-nav">
          <div className="nav-main">
            <Link to="/">HOME</Link>
            <Link to="/about">ABOUT</Link>
            <Link to="/active-agents">ACTIVE AGENTS</Link>
            <Link to="/newsletter">NEWSLETTER</Link>
            <Link to="/contact">CONTACT</Link>
          </div>
          {isAuthenticated ? (
            <div className="nav-user">
              <div className="user-section">
                <Link to="/profile" className="username">AGENT {currentUser.toUpperCase()}</Link>
                <button onClick={handleLogout} className="nav-button">LOGOUT</button>
              </div>
            </div>
          ) : (
            <div className="nav-user">
              <Link to="/login">LOGIN</Link>
            </div>
          )}
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={
            isAuthenticated ? 
              <Navigate to="/profile" replace /> : 
              <Login onLogin={handleLogin} />
          } />
          <Route path="/profile" element={
            isAuthenticated ? 
              <ProfilePage username={currentUser} /> : 
              <Navigate to="/login" replace />
          } />
          <Route path="/register" element={
            isAuthenticated ? 
              <Navigate to="/" replace /> : 
              <Register />
          } />
          <Route path="/secure" element={
            isAuthenticated ? 
              <SecurePage /> : 
              <Navigate to="/login" replace />
          } />
          <Route path="/m41nfr4m3" element={
            <MainframeRoute />
          } />
          <Route path="/33154460171852" element={<ProceedPage />} />
          <Route path="/adage" element={<AdagePage />} />
          <Route path="/hints" element={<HintsPage />} />
          <Route path="/active-agents" element={<ActiveAgentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Login({ onLogin }: { onLogin: (username: string, password: string) => Promise<boolean> }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await onLogin(username, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="page-content">
      <h2>Field Agent Login</h2>
      <div className="content-section">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Agent ID:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">AUTHENTICATE</button>
        </form>
        <div className="registration-link">
          <p>New to CXD?</p>
          <Link to="/register" className="nav-button">REGISTER AS FIELD AGENT</Link>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [codeWord, setCodeWord] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (codeWord.toLowerCase() !== 'chrononaut') {
      setError('Invalid code word. Please try again.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      setSuccess(true);
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="page-content">
        <h2>Registration Successful</h2>
        <div className="content-section">
          <p>Welcome to CXD, Agent {username}.</p>
          <p>You may now proceed to the <Link to="/login">login page</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2>Field Agent Registration</h2>
      <div className="content-section">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Agent ID:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="codeWord">Access Key:</label>
            <input
              type="password"
              id="codeWord"
              value={codeWord}
              onChange={(e) => setCodeWord(e.target.value)}
              required
              placeholder="Complete Training Module 2 for Access"
            />
            <p className="form-hint">The access key is required for registration</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">REGISTER</button>
        </form>
      </div>
    </div>
  );
}

function SecurePage() {
  return (
    <div className="page-content">
      <h2>Secure Area</h2>
      <div className="content-section">
        <div className="secure-content">
          <h3>Field Agent Resources</h3>
          <p>Welcome to the secure area. This section contains classified information and resources for active field agents.</p>
          
          <div className="secure-grid">
            <div className="secure-item">
              <h4>Temporal Navigation</h4>
              <ul>
                <li>Current Timeline Status</li>
                <li>Anomaly Reports</li>
                <li>Navigation Protocols</li>
              </ul>
            </div>
            
            <div className="secure-item">
              <h4>Equipment</h4>
              <ul>
                <li>Temporal Stabilizers</li>
                <li>Communication Devices</li>
                <li>Protective Gear</li>
              </ul>
            </div>
            
            <div className="secure-item">
              <h4>Missions</h4>
              <ul>
                <li>Active Assignments</li>
                <li>Mission Briefings</li>
                <li>Status Updates</li>
              </ul>
            </div>
          </div>
          
          <div className="secure-notice">
            <p>Remember: All information in this section is classified. Unauthorized access or disclosure is strictly prohibited.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="page-content">
      <h2>Home</h2>
      <div className="content-section">
        <p>The Institute for Chrononautics, Exploration, and Discovery (CXD) is a clandestine organization dedicated to the study and exploration of temporal anomalies, parallel dimensions, and the mysteries of time itself.</p>
        <p>Our mission is to understand, document, and when necessary, intervene in temporal events that could affect the stability of our timeline.</p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="page-content">
      <h2>About CXD</h2>
      <div className="content-section">
        <h3>Our History</h3>
        <p>Founded in 1947 following the Roswell incident, CXD was established to investigate and understand phenomena that defy conventional scientific explanation.</p>
        
        <h3>Our Mission</h3>
        <p>We are dedicated to:</p>
        <ul>
          <li>Researching temporal anomalies and their effects</li>
          <li>Training field agents in temporal navigation</li>
          <li>Maintaining the integrity of our timeline</li>
          <li>Documenting encounters with parallel dimensions</li>
        </ul>
        
        <h3>Field Agent Program</h3>
        <p>Our Field Agent program is the backbone of CXD operations. Agents are trained in:</p>
        <ul>
          <li>Temporal navigation and safety protocols</li>
          <li>Documentation of temporal anomalies</li>
          <li>Interdimensional communication</li>
          <li>Emergency temporal displacement procedures</li>
        </ul>
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div className="page-content">
      <h2>Newsletter</h2>
      <div className="content-section">
        <h3>Latest Updates</h3>
        <div className="news-item">
          <h4>May 2024 - Temporal Anomaly Report</h4>
          <p>Field agents have reported increased activity in the Pacific Northwest region. All agents are advised to carry their temporal stabilizers at all times.</p>
        </div>
        <div className="news-item">
          <h4>April 2024 - Training Update</h4>
          <p>New temporal navigation protocols have been implemented. All field agents must complete the updated training module by June 1st.</p>
        </div>
        <div className="news-item">
          <h4>March 2024 - Equipment Update</h4>
          <p>Version 3.2 of the temporal stabilizer is now available. Contact your regional coordinator for upgrade scheduling.</p>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="page-content">
      <h2>Contact Us</h2>
      <div className="content-section">
        <h3>Field Agent Support</h3>
        <p>For active field agents, please use your assigned secure communication channels.</p>
        
        <h3>Prospective Agents</h3>
        <p>If you believe you have experienced a temporal anomaly or have information about potential temporal events, please contact your nearest CXD office.</p>
        
        <h3>Regional Offices</h3>
        <ul>
          <li>North American Division: [REDACTED]</li>
          <li>European Division: [REDACTED]</li>
          <li>Asian Division: [REDACTED]</li>
          <li>South American Division: [REDACTED]</li>
        </ul>
        
        <p className="disclaimer">Note: All communications are monitored and recorded for security purposes.</p>
      </div>
    </div>
  );
}

function MainframeLogin({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (onLogin(password)) {
      return;
    }
    setError('Invalid access code. Please try again.');
  };

  return (
    <div className="page-content">
      <h2>Mainframe Access</h2>
      <div className="content-section">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="mainframe-password">Access Code:</label>
            <input
              type="password"
              id="mainframe-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  );
}

function MainframePage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error connecting to mainframe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h2>Mainframe Interface</h2>
      <div className="content-section">
        <div className="mainframe-display">
          <div className="mainframe-header">
            <span className="blink">_</span>
            <span>SYSTEM READY</span>
            <span className="blink">_</span>
          </div>
          <form onSubmit={handleSubmit} className="mainframe-form">
            <div className="form-group">
              <label htmlFor="message">Enter Command:</label>
              <input
                type="text"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mainframe-input"
                placeholder="to begin, execute code MISSION"
              />
            </div>
            <button type="submit" className="mainframe-button" disabled={isLoading}>
              {isLoading ? 'PROCESSING...' : 'EXECUTE'}
            </button>
          </form>
          {response && (
            <div className="mainframe-response">
              <div className="response-header">SYSTEM RESPONSE:</div>
              <div className="response-content">{response}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProceedPage() {
  return (
    <div className="page-content">
      <h2>Access Granted</h2>
      <div className="content-section">
        <p>You may proceed to the <Link to="/m41nfr4m3" className="mainframe-link">Mainframe</Link></p>
      </div>
    </div>
  );
}

function AdagePage() {
  return (
    <div className="page-content">
      <h2>CXD Motto</h2>
      <div className="content-section">
        <div className="motto-container">
          <p className="motto">EMIT NO EVIL — LIVE ON TIME</p>
        </div>
        <div className="section-complete">
          <p>Congratulations, you have now completed Section 1, and may proceed to Section 2.</p>
          <p>Additionally, moving forward, if you require any assistance for the remainder of this Training Module, you may now refer to the Hints page: <a href="https://cxdpreservation.com/hints" className="hints-link" target="_blank" rel="noopener noreferrer">cxdpreservation.com/hints</a>.</p>
        </div>
        <div className="additional-info">
          <h3>ADDITIONAL INFORMATION</h3>
          <p>(not necessary for the purposes of this Training Module)</p>
          <p>The CXD motto can be found on all Field Agent medallions as well as Field Agent trainee badges. It is a reminder to always strive to create the best possible timeline for all inhabitants, and to make the most of each of our individual actions.</p>
          <p className="historical-note">(For our agents operating around the "15th century" region of the timescape, the motto was much easier to replicate on printing presses for their secret communications since it only contains 8 different letters and simply requires their orders to be reversed. You're welcome, Agnes.)</p>
        </div>
      </div>
    </div>
  );
}

function HintsPage() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const hints = {
    "1.2.1": "To complete section two, you may need to bend the cards to your will to ensure that the icons of the ages align on a flat wall ...",
    "1.3.4": "Noted on the /Guidance page, as a result of temporal disturbance, card 1.3.4 has become compromised—the relevant signpost has been temporarily removed from this timeline. In the mean...time... please take this moment now to fill in card 1.3.4 with: 33",
    "1.3.6": "The relevant marker that you are looking for can be located by walking 550ft west from the CXD Hub (the machine from which you procured this training module).",
    "1.3.8": "The relevant marker that you are looking for can be located by walking 240ft west by northwest from the CXD Hub (the machine from which you procured this training module).",
    "1.3.10": "The relevant marker that you are looking for can be located by walking 150ft south from the CXD Hub (the machine from which you procured this training module).",
    "1.3.12": "The relevant marker that you are looking for can be located mere feet from the CXD Hub (the machine from which you procured this training module).\n\nWatch your step!",
    "1.3.14": "The relevant marker that you are looking for can be located by walking 380ft north from the CXD Hub (the machine from which you procured this training module).\n\nThis one rocks.",
    "1.3.15": "If you have completed the numbers at the top of Card 1.3.15 but are not reaching the password-protected entry for the CXD Mainframe, feel free to review the hints for the respective cards in this Section (we would recommend checking 1.3.4 first).",
    "1.3.16": "To obtain the password to the CXD Mainframe, you will need to locate the physical structure featured on Card 1.3.16.\n\nThe structure can be found by walking 300ft northwest from the CXD Hub (the machine from which you procured this training module).\n\nYou will need to inspect both sides (or, as they would have said in Latin, \"utrimque\").",
    "2.1.21": "The locations listed in this section can be found in the following regions of Washington Park:\n\nThe gazebo: center of the park\nThe cannon: south of the gazebo\nThe entry: this can be found on the stone pillars at most entries to the park\nThe tower: look far in the distance to the north\nThe mosaic tiles: this bench can be found in the southwest corner of the park\nThe castle: this can be found in the southeast corner of the park\nThe quill: look to a building's wall just across the street to the east of the park\nThe music hall: this can be seen just across the street to the northwest of the park",
    "2.2.1": "To arrange the cards so that the arrows in the corners match, lay them out in the following grid:\n\n2.1.20  2.1.16  2.1.6\n2.1.4    2.1.12   2.1.10\n2.1.14   2.1.8   2.1.18",
    "2.2.3": "For example, you may choose the number 2109. To complete this calculation, you should then:\n\nArrange the digits into descending and then ascending order: 9210 & 129\nSubtract the smaller number from the larger number: 9210 - 129 = 9081\nRepeat the previous steps with the new number: 9081 >>> 9810 - 189 = 9621\nContinue this process until you consistently reach the same number.\n\nNOTE: This calculation may take up to 7 steps."
  };

  return (
    <div className="page-content">
      <h2>Training Module Hints</h2>
      <div className="content-section">
        <p className="hints-intro">
          Below you can find hints pertaining to specific cards. We encourage you to make an attempt before resorting to them, but leave the decision to you. Click on a card below to reveal a hint pertaining to a specific card.
        </p>
        <div className="hints-container">
          {Object.entries(hints).map(([cardId, hint]) => (
            <div key={cardId} className="hint-card">
              <button 
                className={`hint-card-header ${expandedCards.has(cardId) ? 'expanded' : ''}`}
                onClick={() => toggleCard(cardId)}
              >
                Card {cardId}
                <span className="card-arrow">{expandedCards.has(cardId) ? '▼' : '▶'}</span>
              </button>
              {expandedCards.has(cardId) && (
                <div className="hint-content">
                  {hint.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActiveAgentsPage() {
  const [agents, setAgents] = useState<Array<{name: string, rank: string, title: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/agents`);
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data.agents);
      } catch (err) {
        setError('Failed to load agents list');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <h2>Active Agents</h2>
        <div className="content-section">
          <p>Loading agents list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h2>Active Agents</h2>
        <div className="content-section">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h2>Active Agents</h2>
      <div className="content-section">
        <div className="agents-list">
          <div className="agents-header">
            <div className="column">Agent Name</div>
            <div className="column">Rank</div>
            <div className="column">Title</div>
          </div>
          {agents.map((agent, index) => (
            <div key={index} className="agent-row">
              <div className="column">{agent.name}</div>
              <div className="column">{agent.rank}</div>
              <div className="column">{agent.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ username }: { username: string }) {
  const [missions, setMissions] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [rank, setRank] = useState('');
  const [newMission, setNewMission] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableTitles, setAvailableTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for:', username);
        const response = await fetch(`${API_URL}/api/profile/${username}`);
        console.log('Profile response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Profile fetch error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        
        const data = await response.json();
        console.log('Profile data received:', data);
        setMissions(data.missions || []);
        setTitle(data.title || '');
        setRank(data.rank || '');
        setAvailableTitles(data.availableTitles || []);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      }
    };

    fetchProfile();
  }, [username]);

  const handleAddMission = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/profile/${username}/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ missionWord: newMission }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add mission');
      }

      const data = await response.json();
      setMissions(data.missions);
      setAvailableTitles(data.availableTitles);
      setRank(data.rank);
      setNewMission('');
      setSuccess('Mission added successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add mission');
    }
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTitle = e.target.value;
    try {
      const response = await fetch(`${API_URL}/api/profile/${username}/title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to update title');
      
      setTitle(newTitle);
      setSuccess('Title updated successfully');
    } catch (err) {
      setError('Failed to update title');
    }
  };

  return (
    <div className="page-content">
      <h2>Agent Profile</h2>
      <div className="content-section">
        <div className="profile-section">
          <h3>Agent Information</h3>
          <div className="profile-info">
            <p><strong>Agent ID:</strong> {username}</p>
            <p><strong>Rank:</strong> {rank}</p>
            <div className="title-selector">
              <label htmlFor="title">Title:</label>
              <select
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="title-select"
                disabled={availableTitles.length === 0}
              >
                <option value="">{availableTitles.length === 0 ? 'Complete non-Training Module missions to unlock Titles' : 'Select a title'}</option>
                {availableTitles.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="mainframe-link-container">
              <Link to="/m41nfr4m3" state={{ fromProfile: true }} className="mainframe-link">Access Mainframe</Link>
            </div>
          </div>
        </div>

        <div className="missions-section">
          <h3>Completed Missions</h3>
          {missions.length === 0 ? (
            <p>No missions completed yet.</p>
          ) : (
            <ul className="missions-list">
              {missions.map((mission, index) => (
                <li key={index} className="mission-item">
                  {mission}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddMission} className="mission-form">
            <div className="form-group">
              <label htmlFor="mission">Add Mission:</label>
              <input
                type="text"
                id="mission"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
                placeholder={rank === 'Field Agent' ? "Enter mission word" : "Enter the Training Module 2 keyword to become a Field Agent"}
                required
                disabled={false}
              />
            </div>
            <button 
              type="submit" 
              className="mission-button"
              disabled={false}
            >
              Add Mission
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
