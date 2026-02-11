import React, { useState, useEffect, useRef } from 'react';
import { Subject, AnswerLength, UserPreferences, StudyNotes } from './types';
import { SUBJECTS, SEMESTERS, LENGTH_OPTIONS, ICONS } from './constants';
import { generateStudyNotes } from './geminiService';
import { Button } from './components/Button';
import { NoteViewer } from './components/NoteViewer';
import { ChatBot } from './components/ChatBot';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { Footer } from './components/Footer';

const LOADING_MESSAGES = [
  "Checking PCI syllabus guidelines...",
  "Reviewing past university questions...",
  "Formatting exam-ready points...",
  "Creating simple mnemonics...",
  "Generating viva questions...",
  "Structuring long-answer responses..."
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'lab'>('notes');
  const [prefs, setPrefs] = useState<UserPreferences>({
    subject: Subject.HAP,
    topic: '',
    semester: 'Semester 1',
    university: '',
    length: AnswerLength.Exam,
    includeDiagrams: true,
    includeMnemonics: true,
    includeClinicalCorrelation: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [notes, setNotes] = useState<StudyNotes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const loadingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (loading) {
      loadingIntervalRef.current = window.setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
      setLoadingMessageIndex(0);
    }
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, [loading]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs.topic.trim()) {
      setError("Please enter a topic name.");
      return;
    }

    setLoading(true);
    setError(null);
    setNotes(null);

    try {
      const generatedNotes = await generateStudyNotes(prefs);
      setNotes(generatedNotes);
      setTimeout(() => {
        const container = document.getElementById('notes-container');
        if (container) {
          window.scrollTo({ 
            top: container.offsetTop - 80, 
            behavior: 'smooth' 
          });
        }
      }, 150);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "A technical error occurred while generating notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950 pb-20">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 no-print transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              <ICONS.Book className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Pharm<span className="text-emerald-600">Mentor</span></span>
              <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest leading-none">Academic AI Hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
              <button 
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'notes' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Study Notes
              </button>
              <button 
                onClick={() => setActiveTab('lab')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'lab' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Image Lab
              </button>
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              aria-label="Toggle Theme"
            >
              {darkMode ? <ICONS.Sun className="w-5 h-5" /> : <ICONS.Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-emerald-900 pt-16 pb-32 no-print dark:from-slate-950 dark:via-indigo-950 dark:to-emerald-950 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-indigo-100 text-sm font-bold mb-8 border border-white/10">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            Powered by Gemini-3 Intelligence
          </div>
          
          {activeTab === 'notes' ? (
            <>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Master Pharmacy Subjects <br />
                <span className="text-emerald-400">Like a Pro</span>
              </h1>
              <p className="text-indigo-100 dark:text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                Generate exam-perfect notes, mnemonics, and practice questions aligned with the PCI syllabus in seconds.
              </p>
              
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-slate-800 backdrop-blur-sm text-left relative z-10 transition-all duration-300">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Subject</label>
                      <select 
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 transition-all outline-none bg-slate-50 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                        value={prefs.subject}
                        onChange={(e) => setPrefs({...prefs, subject: e.target.value as Subject})}
                        disabled={loading}
                      >
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Topic Name</label>
                      <input 
                        type="text"
                        placeholder="e.g., Cardiac Cycle, Limit Test for Iron..."
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 transition-all outline-none bg-slate-50 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                        value={prefs.topic}
                        onChange={(e) => setPrefs({...prefs, topic: e.target.value})}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Semester</label>
                      <select 
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 transition-all outline-none bg-slate-50 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                        value={prefs.semester}
                        onChange={(e) => setPrefs({...prefs, semester: e.target.value})}
                        disabled={loading}
                      >
                        {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Note Depth</label>
                      <select 
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 transition-all outline-none bg-slate-50 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                        value={prefs.length}
                        onChange={(e) => setPrefs({...prefs, length: e.target.value as AnswerLength})}
                        disabled={loading}
                      >
                        {LENGTH_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">University (Optional)</label>
                      <input 
                        type="text"
                        placeholder="AKTU, RGPV, SPPU..."
                        className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 focus:border-emerald-500 transition-all outline-none bg-slate-50 dark:bg-slate-950 font-medium text-slate-800 dark:text-slate-200"
                        value={prefs.university}
                        onChange={(e) => setPrefs({...prefs, university: e.target.value})}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-950"
                        checked={prefs.includeDiagrams}
                        onChange={(e) => setPrefs({...prefs, includeDiagrams: e.target.checked})}
                        disabled={loading}
                      />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Include Diagrams</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-950"
                        checked={prefs.includeMnemonics}
                        onChange={(e) => setPrefs({...prefs, includeMnemonics: e.target.checked})}
                        disabled={loading}
                      />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Mnemonics</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 dark:bg-slate-950"
                        checked={prefs.includeClinicalCorrelation}
                        onChange={(e) => setPrefs({...prefs, includeClinicalCorrelation: e.target.checked})}
                        disabled={loading}
                      />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Clinical Focus</span>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 text-lg" 
                    variant="primary"
                    isLoading={loading}
                  >
                    <ICONS.Pencil className="w-5 h-5" />
                    {loading ? 'Compiling Notes...' : 'Generate My Exam Notes'}
                  </Button>
                </form>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl flex items-start gap-3 font-medium border border-red-100 dark:border-red-900/30">
                    <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center font-bold">!</span>
                    <div>
                      <p className="font-bold mb-1 text-sm">Action Required</p>
                      <p className="text-xs opacity-90">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Academic <span className="text-emerald-400">Scanner Lab</span>
              </h1>
              <p className="text-indigo-100 dark:text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                Identify and analyze pharmaceutical diagrams or apparatus using computer vision.
              </p>
              <ImageAnalyzer />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div id="notes-container" className="relative -mt-16 pb-20 scroll-mt-20">
        {activeTab === 'notes' && (
          <div className="max-w-4xl mx-auto px-4">
            {loading && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="inline-block relative">
                  <div className="w-20 h-20 border-4 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                    <ICONS.Brain className="w-8 h-8 animate-pulse" />
                  </div>
                </div>
                <h2 className="mt-8 text-2xl font-bold text-slate-800 dark:text-slate-100">Compiling Academic Insights...</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400">{LOADING_MESSAGES[loadingMessageIndex]}</p>
                <div className="mt-8 flex justify-center gap-2">
                  <div className={`w-2 h-2 bg-emerald-600 rounded-full animate-bounce ${loadingMessageIndex % 3 === 0 ? 'delay-75' : ''}`}></div>
                  <div className={`w-2 h-2 bg-emerald-600 rounded-full animate-bounce ${loadingMessageIndex % 3 === 1 ? 'delay-150' : ''}`}></div>
                  <div className={`w-2 h-2 bg-emerald-600 rounded-full animate-bounce ${loadingMessageIndex % 3 === 2 ? 'delay-225' : ''}`}></div>
                </div>
              </div>
            )}

            {notes && !loading && <NoteViewer notes={notes} subject={prefs.subject} topic={prefs.topic} />}

            {!notes && !loading && (
              <div className="grid md:grid-cols-3 gap-8 py-20 no-print">
                <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <ICONS.Brain className="w-8 h-8 text-indigo-600 mb-6" />
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Smart Mnemonics</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Memorize complex classifications with custom memory aids.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <ICONS.Pencil className="w-8 h-8 text-emerald-600 mb-6" />
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Exam Oriented</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Content structured for 2, 5, and 10 marks PCI patterns.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <ICONS.Check className="w-8 h-8 text-amber-600 mb-6" />
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Viva Ready</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Practice with AI-generated oral exam questions.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <ChatBot />

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 h-16 flex items-center justify-around lg:hidden z-50 no-print">
        <button onClick={() => setActiveTab('notes')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'notes' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <ICONS.Book className="w-5 h-5" />
          <span className="text-[10px] font-bold">Notes</span>
        </button>
        <button onClick={() => setActiveTab('lab')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'lab' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <ICONS.Scan className="w-5 h-5" />
          <span className="text-[10px] font-bold">Lab</span>
        </button>
      </div>
    </div>
  );
};

export default App;