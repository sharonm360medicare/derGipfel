import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { ClassNumber, GermanLevel, Candidate } from '../types/competition';
import { Send, CheckCircle2, FileText, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';
import { playClickSound, playScoreChime } from '../utils/sound';

export const RegistrationSection: React.FC = () => {
  const { registerCandidate } = useCompetition();

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
              LEVEL 01 — ANMELDUNG & QUALIFIKATION
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tight text-neutral-900 mt-1 leading-[0.95]">
              EINZELKANDIDAT
              <br />
              <span className="text-red-600">REGISTRIERUNG</span>
            </h2>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Die erste Stufe des Wettbewerbs <strong>DER GIPFEL</strong> wird von jedem Schüler individuell
            absolviert. Reichen Sie Ihr Qualifikationsprojekt und Ihre Angaben ein.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Individuelle Einreichung
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Themenwahl zu deutscher Literatur, Landeskunde, Wissenschaft oder Medienanalyse.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Bewertung durch den Quizmeister
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Die Einreichungen werden in der geschützten Leitstelle begutachtet und bepunktet.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-start gap-3.5">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Gruppen-Verkündung (Top 6)
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Die stärksten Kandidaten jeder Klasse werden offiziell zum repräsentativen Klassen-Team formiert.
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
                  Bewerbung Erfolgreich Übermittelt
                </span>
                <h3 className="text-2xl font-display font-black text-neutral-900 mt-1">
                  Willkommen bei DER GIPFEL, {submittedCandidate.name}!
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                  Ihre Einreichung für <strong>{submittedCandidate.classDivision}</strong> ist eingegangen
                  und wird in der nächsten Prüfungsschleife bewertet.
                </p>
              </div>

              {/* Candidate Badge Card */}
              <div className="max-w-md mx-auto p-5 bg-neutral-50 border border-neutral-200 rounded-xl text-left space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="text-2xs font-mono text-neutral-500 uppercase">Kandidaten-Identifikationsnummer</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {submittedCandidate.id}
                    </span>
                    <button
                      onClick={() => copyCandidateId(submittedCandidate.id)}
                      className="p-1 text-neutral-500 hover:text-neutral-900 rounded transition-colors"
                      title="ID kopieren"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-2xs text-neutral-400 block">Projekt:</span>
                    <span className="font-semibold text-neutral-800 line-clamp-1">
                      {submittedCandidate.projectTitle}
                    </span>
                  </div>
                  <div>
                    <span className="text-2xs text-neutral-400 block">Sprachniveau:</span>
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
                  Weiteren Kandidaten Anmelden
                </button>
                <a
                  href="#gruppen"
                  className="px-4 py-2.5 text-neutral-600 hover:text-neutral-900 text-xs font-semibold inline-flex items-center gap-1"
                >
                  <span>Zu den Gruppen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="text-lg font-display font-bold uppercase text-neutral-900">
                  Offizielles Bewerbungsformular
                </h3>
                <p className="text-xs text-neutral-500">
                  Bitte füllen Sie alle Pflichtfelder sorgfältig aus.
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Vollständiger Name des Schülers *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="z.B. Katharina von Weber"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    E-Mail Adresse *
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
                    Schule / Gymnasium *
                  </label>
                  <input
                    type="text"
                    required
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="z.B. Humboldt-Gymnasium Berlin"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Klassenstufe *
                  </label>
                  <select
                    value={classDivision}
                    onChange={(e) => setClassDivision(e.target.value as ClassNumber)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-semibold"
                  >
                    <option value="Class 01">Klasse 01</option>
                    <option value="Class 02">Klasse 02</option>
                    <option value="Class 03">Klasse 03</option>
                    <option value="Class 04">Klasse 04</option>
                    <option value="Class 05">Klasse 05</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Deutsch-Niveau (GER) *
                  </label>
                  <select
                    value={germanLevel}
                    onChange={(e) => setGermanLevel(e.target.value as GermanLevel)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-semibold"
                  >
                    <option value="A1">A1 (Grundstufe)</option>
                    <option value="A2">A2 (Grundkenntnisse)</option>
                    <option value="B1">B1 (Mittelstufe)</option>
                    <option value="B2">B2 (Fortgeschritten)</option>
                  </select>
                </div>
              </div>

              {/* Project Entry Details */}
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Titel des Qualifikations-Projekts *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="z.B. Deutsche Erfindungen und ihr globaler Einfluss"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Kurzbeschreibung / These des Beitrags *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Erläutern Sie kurz Inhalt, Methodik und sprachliche Schwerpunkte Ihres Projekts..."
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Link zum Projekt / Video / Dokument (Optional)
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
                  <span>Projekt Einreichen & Anmelden</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
