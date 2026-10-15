import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { ClassNumber, GermanLevel, Candidate } from '../types/competition';
import { Send, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { playClickSound, playScoreChime } from '../utils/sound';

export const RegistrationSection: React.FC = () => {
  const { registerCandidate, t, language } = useCompetition();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [classDivision, setClassDivision] = useState<ClassNumber>('Class 01');
  const [germanLevel, setGermanLevel] = useState<GermanLevel>('B1');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');

  const [submittedCandidate, setSubmittedCandidate] = useState<Candidate | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !school || !projectTitle || !projectDescription) return;

    const newCandidate = registerCandidate({
      name: fullName.trim(),
      email: email.trim(),
      school: school.trim(),
      classDivision,
      germanLevel,
      projectTitle: projectTitle.trim(),
      projectDescription: projectDescription.trim(),
      submissionLink: submissionLink.trim() || 'https://gipfel-cloud.internal/submissions/default-entry.pdf',
    });

    playScoreChime();
    setSubmittedCandidate(newCandidate);

    // Reset fields
    setFullName('');
    setEmail('');
    setSchool('');
    setProjectTitle('');
    setProjectDescription('');
    setSubmissionLink('');
  };

  const copyCandidateId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <section id="anmeldung" className="py-20 border-t border-neutral-200 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
              {t.registration.kicker}
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.95]">
              {language === 'de' ? 'EINZELKANDIDAT' : 'INDIVIDUAL CANDIDATE'}
              <br />
              <span className="text-red-600">{language === 'de' ? 'REGISTRIERUNG' : 'REGISTRATION'}</span>
            </h2>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            {language === 'de'
              ? 'Die erste Stufe des Wettbewerbs DER GIPFEL wird von jedem Schüler individuell absolviert. Reichen Sie Ihr Qualifikationsprojekt und Ihre Angaben ein.'
              : 'Stage 01 of DER GIPFEL is taken individually by every student. Submit your qualification project and candidate information.'}
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {language === 'de' ? 'Individuelle Einreichung' : 'Individual Submission'}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'de'
                    ? 'Themenwahl zu deutscher Literatur, Landeskunde, Wissenschaft oder Medienanalyse.'
                    : 'Choice of German literature, cultural geography, science, or media analysis.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {language === 'de' ? 'Bewertung durch den Quizmeister' : 'Quiz Master Evaluation'}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'de'
                    ? 'Die Einreichungen werden in der geschützten Leitstelle begutachtet und bepunktet.'
                    : 'Submissions are reviewed and scored in the protected Quiz Master portal.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  {language === 'de' ? 'Gruppen-Verkündung (Top 6)' : 'Team Selection (Top 6)'}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'de'
                    ? 'Die stärksten Kandidaten jeder Klasse werden offiziell zum repräsentativen Klassen-Team formiert.'
                    : 'The highest-ranking candidates of each grade form the representative championship squad.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm">
          {submittedCandidate ? (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-2xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
                  {t.registration.successModalTitle}
                </span>
                <h3 className="text-2xl font-display font-black text-neutral-900 mt-1">
                  {language === 'de' ? `Willkommen bei DER GIPFEL, ${submittedCandidate.name}!` : `Welcome to DER GIPFEL, ${submittedCandidate.name}!`}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  {language === 'de'
                    ? `Ihre Einreichung für ${submittedCandidate.classDivision} ist eingegangen und wird in der nächsten Prüfungsschleife bewertet.`
                    : `Your entry for ${submittedCandidate.classDivision} was received and will be scored in the next evaluation cycle.`}
                </p>
              </div>

              {/* Candidate Badge Card */}
              <div className="max-w-md mx-auto p-5 bg-neutral-50 border border-neutral-200 rounded-xl text-left space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-2xs font-mono text-neutral-500 uppercase">
                    {t.registration.candidateIdLabel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {submittedCandidate.id}
                    </span>
                    <button
                      onClick={() => copyCandidateId(submittedCandidate.id)}
                      className="p-1 text-neutral-500 hover:text-neutral-900 rounded transition-colors"
                      title={t.registration.copyId}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-2xs text-neutral-400 block">
                      {language === 'de' ? 'Projekt:' : 'Project:'}
                    </span>
                    <span className="font-semibold text-neutral-800 line-clamp-1">
                      {submittedCandidate.projectTitle}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xs text-neutral-400 block">
                      {language === 'de' ? 'Sprachniveau:' : 'Level:'}
                    </span>
                    <span className="font-semibold text-neutral-800">
                      Goethe {submittedCandidate.germanLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setSubmittedCandidate(null)}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  {language === 'de' ? 'Weiteren Kandidaten Anmelden' : 'Register Another Candidate'}
                </button>
                <a
                  href="#gruppen"
                  className="px-4 py-2.5 text-neutral-600 hover:text-neutral-900 text-xs font-semibold inline-flex items-center gap-1"
                >
                  <span>{language === 'de' ? 'Zu den Gruppen' : 'View Squads'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-lg font-display font-bold uppercase text-neutral-900">
                  {language === 'de' ? 'Offizielles Bewerbungsformular' : 'Official Entry Form'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'de' ? 'Bitte füllen Sie alle Pflichtfelder sorgfältig aus.' : 'Please fill in all mandatory fields with care.'}
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'de' ? 'z.B. Katharina von Weber' : 'e.g. Katharina von Weber'}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.email}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="schueler@schule.de"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.school}
                  </label>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder={language === 'de' ? 'z.B. Humboldt-Gymnasium' : 'e.g. Humboldt Gymnasium'}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.classLevel}
                  </label>
                  <select
                    value={classDivision}
                    onChange={(e) => setClassDivision(e.target.value as ClassNumber)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-semibold"
                  >
                    <option value="Class 01">{language === 'de' ? 'Klasse 01' : 'Class 01'}</option>
                    <option value="Class 02">{language === 'de' ? 'Klasse 02' : 'Class 02'}</option>
                    <option value="Class 03">{language === 'de' ? 'Klasse 03' : 'Class 03'}</option>
                    <option value="Class 04">{language === 'de' ? 'Klasse 04' : 'Class 04'}</option>
                    <option value="Class 05">{language === 'de' ? 'Klasse 05' : 'Class 05'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.germanLevel}
                  </label>
                  <select
                    value={germanLevel}
                    onChange={(e) => setGermanLevel(e.target.value as GermanLevel)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-semibold"
                  >
                    <option value="A1">A1 ({language === 'de' ? 'Grundstufe' : 'Beginner'})</option>
                    <option value="A2">A2 ({language === 'de' ? 'Grundkenntnisse' : 'Elementary'})</option>
                    <option value="B1">B1 ({language === 'de' ? 'Mittelstufe' : 'Intermediate'})</option>
                    <option value="B2">B2 ({language === 'de' ? 'Fortgeschritten' : 'Upper Intermediate'})</option>
                  </select>
                </div>
              </div>

              {/* Project Entry Details */}
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.projectTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder={language === 'de' ? 'z.B. Deutsche Erfindungen und ihr globaler Einfluss' : 'e.g. German Inventions & Global Impact'}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.projectDescription}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder={language === 'de' ? 'Erläutern Sie kurz Inhalt, Methodik und sprachliche Schwerpunkte Ihres Projekts...' : 'Briefly describe content, methodology, and linguistic focus of your project...'}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    {t.registration.submissionLink}
                  </label>
                  <input
                    type="url"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://drive.google.com/... oder Video-Link"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  onClick={() => playClickSound()}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.registration.submitBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
