import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { UploadCloud, CheckCircle2, XCircle, Map, Target, ArrowLeft, Download, Moon, Sun, ExternalLink } from 'lucide-react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  // Custom interactive features
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [checkedTasks, setCheckedTasks] = useState(() => JSON.parse(localStorage.getItem('checkedTasks')) || {});
  
  const resultsRef = useRef();

  const roles = [
    "Software Developer", "Data Scientist", "Product Manager", 
    "UX/UI Designer", "Frontend Developer", "Backend Developer", "Quantitative Analyst"
  ];

  // Theme Persistence
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Checkbox Persistence
  useEffect(() => {
    localStorage.setItem('checkedTasks', JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleTaskToggle = (weekId, taskId) => {
    const key = `${weekId}-${taskId}`;
    setCheckedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].type !== "application/pdf") {
        toast.error("Please upload a PDF file.");
        return;
      }
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !role) return toast.error("Please provide both a resume and a role");

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(response.data);
      toast.success("Roadmap Successfully Generated!");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || "We crashed trying to parse the AI results!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const element = resultsRef.current;
    toast.success("Generating PDF...", { icon: '📄' });
    const opt = {
      margin:       0.5,
      filename:     'Skillix-AI-Roadmap.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container">
      <Toaster position="top-center" toastOptions={{
        style: { background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }
      }}/>
      
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      <header>
        <h1>Skillix AI</h1>
        <p className="subtitle">Discover your true career gaps and instantly generate a customized mastery roadmap backed by AI.</p>
      </header>

      {!analysis ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-group">
            <label>Target Role / Industry</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="" disabled>-- Select Your Dream Role --</option>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Current Resume (PDF strictly)</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div> Extracting Insights...
              </>
            ) : (
              <>
                <UploadCloud size={20} /> Generate Mastery Roadmap
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="results-wrapper">
          <div className="btn-group">
             <button className="submit-btn reset-btn" onClick={() => setAnalysis(null)}>
               <ArrowLeft size={18} /> Re-Analyze Resume
             </button>
             <button className="submit-btn export-btn" onClick={exportPDF}>
               <Download size={18} /> Export Roadmap PDF 
             </button>
          </div>

          <div className="results-container" ref={resultsRef} style={{ background: theme === 'dark' ? '#0f172a' : '#f8fafc', padding: '2rem', borderRadius: '20px' }}>
            
            {/* Top Stats Section */}
            <div className="top-stats-grid">
              
              <div className="skills-container-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card result-card" style={{ padding: '1.5rem' }}>
                  <h3><CheckCircle2 color="#34d399" /> Verified Skills Found</h3>
                  <div className="badges-container">
                    {analysis.identifiedSkills?.length > 0 ? analysis.identifiedSkills.map((s, i) => (
                      <span key={i} className="skill-badge badge-present">{s}</span>
                    )) : <span className="text-muted">None found strictly related to role.</span>}
                  </div>
                </div>

                <div className="glass-card result-card" style={{ padding: '1.5rem' }}>
                  <h3><XCircle color="#f87171" /> Skill Gaps Detected</h3>
                  <div className="badges-container">
                    {analysis.missingSkills?.length > 0 ? analysis.missingSkills.map((item, i) => (
                      <a key={i} href={item.studyLink || '#'} target="_blank" rel="noreferrer" className="skill-badge badge-missing has-link">
                         {item.skill || item} <ExternalLink size={12}/>
                      </a>
                    )) : <span className="text-muted">No major gaps detected!</span>}
                  </div>
                </div>
              </div>

              {/* ATS Score Meter */}
              <div className="glass-card ats-card">
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>ATS Match Score</h3>
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                      strokeDasharray={`${analysis.atsScore || 0}, 100`}
                      stroke={analysis.atsScore >= 80 ? '#34d399' : analysis.atsScore >= 50 ? '#fbbf24' : '#ef4444'}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage" style={{ fill: theme === 'dark' ? '#fff' : '#111' }}>
                      {analysis.atsScore || 0}%
                    </text>
                  </svg>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resume vs Job Role</p>
              </div>

            </div>

            {/* Interactive Timeline */}
            <div className="glass-card result-card" style={{ padding: '2.5rem', marginTop: '1.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 0 }}>
                <Map color="#818cf8" size={28} /> Interactive 4-Week Roadmap
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Follow this structurally generated curriculum. Check tasks off to track progress!</p>
              
              <div className="roadmap">
                {analysis.roadmap?.map((weekData) => (
                  <div key={weekData.week} className="roadmap-week">
                    <div className="week-title">
                      <Target size={18} /> Week {weekData.week}: {weekData.focus}
                    </div>
                    <div style={{ paddingLeft: '0.5rem' }}>
                      {weekData.tasks.map((task, i) => {
                        const isChecked = checkedTasks[`${weekData.week}-${i}`];
                        return (
                          <label key={i} className={`task-item ${isChecked ? 'completed' : ''}`}>
                            <input 
                              type="checkbox" 
                              className="custom-checkbox"
                              checked={!!isChecked}
                              onChange={() => handleTaskToggle(weekData.week, i)}
                            />
                            <span>{task}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
