
import React, { useState } from 'react';
import { Layout } from './components/Layout.tsx';
import { ToneSelector } from './components/ToneSelector.tsx';
import { RegionSelector } from './components/RegionSelector.tsx';
import { SearchableSelect } from './components/SearchableSelect.tsx';
import { ResultCard } from './components/ResultCard.tsx';
import { ResultModal } from './components/ResultModal.tsx';
import { AppTab, Configuration, PROMOTIONS } from './types.ts';
import { generateContent } from './services/geminiService.ts';

const DEFAULT_PARENT_BRAND = `Millennium speaks with quiet authority. It is measured, composed, and confident without needing to announce itself. The tone carries institutional credibility and long term stewardship, the kind that comes from decades of operating at a global scale.
The language is polished but not ornamental. It favours clarity over cleverness, reassurance over excitement. When Millennium speaks, it sounds like a host who has seen everything before and knows exactly how to make things work, for guests, partners, owners, and teams.
Emotion is present, but controlled. Warmth shows up as thoughtfulness, care, and consistency rather than overt sentiment. Stories are framed around legacy, trust, reliability, and human connection at scale. Even when talking about innovation or transformation, the tone remains grounded and responsible.
This voice is designed to be trusted. It reassures stakeholders that the brand is stable, globally competent, and quietly evolving without abandoning its foundations.
If Millennium were a person, it would be the experienced chair at the table. Calm, observant, deliberate. Not rushed. Not reactive. Always considered.`;

const DEFAULT_M_SOCIAL = `The challenger voice
M Social speaks in contrast. It is bold, conversational, and culturally fluent. The voice feels alive in the present moment, tuned into art, music, design, and the social energy of the city it lives in.
The tone is confident but playful. It is unafraid of wit, surprise, or informality, but never slips into gimmickry. Language is expressive and visual. It invites participation rather than delivering proclamations. It sounds like someone who knows what is happening right now and wants you inside it.
Emotion is front and centre. M Social tells stories through lived moments, personalities, and atmospheres. It celebrates individuality, creativity, and community. There is a sense of movement and immediacy, as if something is always happening just beyond the frame.
Crucially, M Social is not reckless. Its confidence is backed by intention. The voice pushes boundaries, but it is still curated, still intelligent, still aware that it represents a global hospitality group. The edge is designed, not chaotic.
If M Social were a person, it would be the magnetic friend who knows the city inside out. Stylish without trying too hard. Curious. A little provocative. Always inviting you into the story.`;

export interface GeneratedResult {
  id: string;
  region: string;
  tone: string;
  promotion: string;
  content: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [showResult, setShowResult] = useState(false);
  const [config, setConfig] = useState<Configuration>({
    toneAName: 'Parent Brand',
    toneADescription: DEFAULT_PARENT_BRAND,
    toneBName: 'M Social',
    toneBDescription: DEFAULT_M_SOCIAL
  });

  const [editingTone, setEditingTone] = useState<'toneA' | 'toneB' | null>(null);
  const [tempDescription, setTempDescription] = useState("");

  const [selectedTone, setSelectedTone] = useState<string>('toneA');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Global']);
  const [selectedPromotion, setSelectedPromotion] = useState<string>(PROMOTIONS[0]);
  const [keyDetails, setKeyDetails] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState({ current: 0, total: 0, region: '' });
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [activeResult, setActiveResult] = useState<GeneratedResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const startEditing = (tone: 'toneA' | 'toneB') => {
    setEditingTone(tone);
    setTempDescription(tone === 'toneA' ? config.toneADescription : config.toneBDescription);
  };

  const saveTone = () => {
    if (editingTone === 'toneA') setConfig({ ...config, toneADescription: tempDescription });
    if (editingTone === 'toneB') setConfig({ ...config, toneBDescription: tempDescription });
    setEditingTone(null);
  };

  const handleGenerate = async () => {
    if (!keyDetails.trim() || selectedRegions.length === 0) return;
    
    setIsGenerating(true);
    setGenProgress({ current: 0, total: selectedRegions.length, region: selectedRegions[0] });
    const newResults: GeneratedResult[] = [];
    
    try {
      const toneName = selectedTone === 'toneA' ? config.toneAName : config.toneBName;
      const toneDesc = selectedTone === 'toneA' ? config.toneADescription : config.toneBDescription;
      
      for (let i = 0; i < selectedRegions.length; i++) {
        const region = selectedRegions[i];
        setGenProgress(prev => ({ ...prev, current: i + 1, region }));
        
        const content = await generateContent({
          toneName: toneName,
          toneDescription: toneDesc,
          region: region,
          promotion: selectedPromotion,
          details: keyDetails
        });
        
        newResults.push({
          id: `${region}-${Date.now()}`,
          region,
          tone: toneName,
          promotion: selectedPromotion,
          content
        });
      }
      
      setResults(newResults);
      setShowResult(true);
    } catch (err) {
      console.error(err);
      alert("Encountered a connection error or API limit. Please verify your API Key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setShowResult(false);
    setResults([]);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const openResult = (result: GeneratedResult) => {
    setActiveResult(result);
    setIsModalOpen(true);
  };

  const tones = [
    { id: 'toneA', name: config.toneAName },
    { id: 'toneB', name: config.toneBName }
  ];

  return (
    <Layout>
      <header className="flex flex-col items-center justify-center mb-12 gap-8">
        <div className="text-center select-none">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.04em] bg-gradient-to-b from-white via-white to-purple-500/50 bg-clip-text text-transparent">
            Wordsmithery
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="h-[1px] w-8 bg-purple-500/20" />
            <p className="text-white/30 font-black tracking-[0.5em] uppercase text-[9px]">Content Intelligence</p>
            <div className="h-[1px] w-8 bg-purple-500/20" />
          </div>
        </div>
        
        <nav className="flex p-1 glass-card rounded-full border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative">
          <button 
            onClick={() => { setActiveTab(AppTab.DASHBOARD); handleBack(); }}
            className={`relative z-10 px-10 md:px-12 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-500 ${
              activeTab === AppTab.DASHBOARD ? 'bg-white text-purple-900 shadow-xl scale-105' : 'text-white/30 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab(AppTab.CONFIG)}
            className={`relative z-10 px-10 md:px-12 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-500 ${
              activeTab === AppTab.CONFIG ? 'bg-white text-purple-900 shadow-xl scale-105' : 'text-white/30 hover:text-white'
            }`}
          >
            Settings
          </button>
        </nav>
      </header>

      <div className="tab-content-wrapper min-h-[60vh]">
        {activeTab === AppTab.DASHBOARD ? (
          <div key="dashboard-tab" className="max-w-6xl mx-auto pb-24">
            {!showResult ? (
              <div className="space-y-12 animate-in duration-500">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <p className="text-white/40 text-lg font-light leading-relaxed tracking-wide italic">
                    "A premium creative workspace designed to bridge institutional authority and challenger energy through high-performance linguistic intelligence."
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-5 space-y-10">
                     <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">01</span>
                       <div className="h-px flex-1 bg-white/5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Identity & Reach</span>
                     </div>
                     
                     <ToneSelector 
                      options={tones}
                      selected={selectedTone}
                      onSelect={setSelectedTone}
                    />

                    <RegionSelector 
                      selected={selectedRegions}
                      onChange={setSelectedRegions}
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-10">
                     <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">02</span>
                       <div className="h-px flex-1 bg-white/5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Creative Brief</span>
                     </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Promotion Type</h3>
                        <SearchableSelect 
                          options={PROMOTIONS}
                          value={selectedPromotion}
                          onChange={setSelectedPromotion}
                          placeholder="Choose a campaign theme..."
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Objectives & Offer</h3>
                        </div>
                        <textarea 
                          value={keyDetails}
                          onChange={(e) => setKeyDetails(e.target.value)}
                          placeholder="Describe campaign goals, offer terms, and key messages..."
                          className="w-full h-60 glass-card rounded-[2rem] p-8 focus:outline-none text-white/90 placeholder:text-white/10 resize-none transition-all border border-white/5 hover:border-white/10 text-lg leading-relaxed shadow-inner font-light"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex flex-col items-center gap-4">
                  <div className={`transition-all duration-500 flex flex-col items-center gap-2 ${isGenerating ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 animate-pulse">
                       Crafting {genProgress.region}...
                     </span>
                     <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-purple-500 transition-all duration-500" 
                        style={{ width: `${(genProgress.current / genProgress.total) * 100}%` }}
                       />
                     </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !keyDetails.trim() || selectedRegions.length === 0}
                    className={`w-full max-w-md gradient-border-button h-[64px] rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_15px_40px_rgba(143,68,173,0.2)]`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-[2px] border-white/30 border-t-white rounded-full animate-spin" />
                        Weaving
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        Deploy Engine
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div key="results-view" className="animate-in duration-500">
                <div className="flex justify-between items-center mb-12 px-4">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-4 px-6 py-3 glass-card rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all border-white/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Modify Parameters
                  </button>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.3em]">
                      Collection Compiled
                    </span>
                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">
                      {results.length} Variants Crafted
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                  {results.map((res, idx) => (
                    <div 
                      key={res.id} 
                      className="animate-slide-up opacity-0" 
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <ResultCard 
                        region={res.region}
                        tone={res.tone}
                        promotion={res.promotion}
                        content={res.content}
                        onClick={() => openResult(res)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div key="settings-tab" className="max-w-5xl mx-auto animate-in duration-500 pb-32">
            <div className="glass-card rounded-[2.5rem] p-12 space-y-12 border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <header className="border-b border-white/5 pb-8 relative z-10">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Linguistic Core</h2>
                <p className="text-white/40 mt-3 font-medium text-lg leading-relaxed max-w-xl font-light">
                  Define the linguistic DNA of your brand identities.
                </p>
              </header>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{config.toneAName}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span className="text-[9px] text-purple-300 tracking-[0.2em] uppercase font-black">Foundation</span>
                    </div>
                  </div>
                  {editingTone !== 'toneA' ? (
                    <button 
                      onClick={() => startEditing('toneA')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 text-[9px] font-black uppercase tracking-widest"
                    >
                      Edit Spec
                    </button>
                  ) : (
                    <button 
                      onClick={saveTone}
                      className="px-8 py-3 rounded-xl bg-white text-purple-900 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
                
                <div className={`rounded-[1.5rem] p-8 border transition-all duration-500 ${editingTone === 'toneA' ? 'bg-white/5 border-purple-500/40' : 'bg-black/40 border-white/5'}`}>
                  {editingTone === 'toneA' ? (
                    <textarea 
                      autoFocus
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="w-full h-64 bg-transparent border-none focus:outline-none text-white/90 leading-relaxed resize-none text-lg font-light tracking-wide custom-scrollbar"
                    />
                  ) : (
                    <p className="text-white/40 leading-relaxed whitespace-pre-wrap text-lg font-light tracking-wide h-64 overflow-y-auto custom-scrollbar">{config.toneADescription}</p>
                  )}
                </div>
              </div>

              <div className="space-y-8 pt-12 border-t border-white/5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{config.toneBName}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span className="text-[9px] text-purple-300 tracking-[0.2em] uppercase font-black">Challenger</span>
                    </div>
                  </div>
                  {editingTone !== 'toneB' ? (
                    <button 
                      onClick={() => startEditing('toneB')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5 text-[9px] font-black uppercase tracking-widest"
                    >
                      Edit Spec
                    </button>
                  ) : (
                    <button 
                      onClick={saveTone}
                      className="px-8 py-3 rounded-xl bg-white text-purple-900 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
                
                <div className={`rounded-[1.5rem] p-8 border transition-all duration-500 ${editingTone === 'toneB' ? 'bg-white/5 border-purple-500/40' : 'bg-black/40 border-white/5'}`}>
                  {editingTone === 'toneB' ? (
                    <textarea 
                      autoFocus
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="w-full h-64 bg-transparent border-none focus:outline-none text-white/90 leading-relaxed resize-none text-lg font-light tracking-wide custom-scrollbar"
                    />
                  ) : (
                    <p className="text-white/40 leading-relaxed whitespace-pre-wrap text-lg font-light tracking-wide h-64 overflow-y-auto custom-scrollbar">{config.toneBDescription}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ResultModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={activeResult}
        onCopy={handleCopy}
        copyFeedback={copyFeedback}
      />
    </Layout>
  );
};

export default App;
