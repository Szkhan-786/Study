
import React from 'react';
import { StudyNotes, Subject } from '../types';
import { ICONS } from '../constants';

interface NoteViewerProps {
  notes: StudyNotes;
  subject: Subject;
  topic: string;
}

export const NoteViewer: React.FC<NoteViewerProps> = ({ notes, subject, topic }) => {
  const handlePrint = () => window.print();

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="mb-10 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm break-inside-avoid transition-colors duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">{title}</h3>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header Info */}
      <div className="mb-12 text-center">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-bold rounded-full mb-4 uppercase tracking-widest">
          {subject}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 capitalize leading-tight">
          {topic}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Comprehensive Exam-Oriented Academic Notes</p>
        
        <div className="flex justify-center gap-4 mt-8 no-print">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-200 dark:shadow-none font-semibold"
          >
            <ICONS.Download className="w-4 h-4" />
            Download PDF / Print
          </button>
        </div>
      </div>

      <Section title="1. Introduction" icon={ICONS.Book}>
        <p>{notes.introduction}</p>
      </Section>

      {notes.definition && (
        <Section title="2. Definition" icon={ICONS.Pencil}>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border-l-4 border-indigo-500 italic text-lg text-slate-700 dark:text-slate-300">
            "{notes.definition}"
          </div>
        </Section>
      )}

      {notes.classification && notes.classification.length > 0 && (
        <Section title="3. Classification / Types" icon={ICONS.Check}>
          <div className="grid gap-4">
            {notes.classification.map((item, i) => (
              <div key={i} className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">{item.type}</span>
                <p className="text-slate-600 dark:text-slate-400">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="4. Detailed Explanation" icon={ICONS.Pencil}>
        <ul className="list-disc pl-5 space-y-3">
          {notes.detailedExplanation.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </Section>

      <Section title="5. Pharmacy Examples" icon={ICONS.Check}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {notes.examples.map((ex, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <span className="font-bold mt-0.5">•</span>
              <span>{ex}</span>
            </div>
          ))}
        </div>
      </Section>

      {notes.diagramDescription && (
        <Section title="6. Diagram Description" icon={ICONS.Book}>
          <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Schematic Visualization:</h4>
            <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-400">{notes.diagramDescription}</p>
          </div>
        </Section>
      )}

      {notes.clinicalCorrelation && (
        <Section title="7. Clinical/Practical Correlation" icon={ICONS.Brain}>
          <p>{notes.clinicalCorrelation}</p>
        </Section>
      )}

      <Section title="8. Exam Focus Points" icon={ICONS.Check}>
        <div className="space-y-4">
          {notes.examPoints.map((p, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                  !
                </span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{p.point}</p>
              </div>
              {p.mnemonic && (
                <div className="ml-9 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-mono text-sm">
                  <span className="font-bold mr-2">Mnemonic:</span> {p.mnemonic}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4 border-b dark:border-slate-800 pb-2">Short Answer (2-5 Marks)</h4>
          <ul className="space-y-4">
            {notes.shortAnswerQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-300 dark:text-slate-700">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <h4 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4 border-b dark:border-slate-800 pb-2">Long Answer (5-10 Marks)</h4>
          <ul className="space-y-4">
            {notes.longAnswerQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-300 dark:text-slate-700">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-indigo-950 p-8 rounded-2xl text-white shadow-2xl shadow-indigo-100 dark:shadow-none mb-10 transition-colors duration-300">
        <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ICONS.Book className="w-5 h-5 text-indigo-400" />
          Previous Year Style Questions (PYQs)
        </h4>
        <div className="grid gap-4">
          {notes.pyqs.map((q, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <p className="text-slate-300">{q}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-600 dark:bg-indigo-700 p-8 rounded-2xl text-white shadow-xl mb-12 transition-colors duration-300">
        <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ICONS.Brain className="w-5 h-5 text-indigo-200" />
          Viva Voce Practice
        </h4>
        <div className="space-y-4">
          {notes.vivaQuestions.map((q, i) => (
            <div key={i} className="flex gap-3">
              <span className="font-bold text-indigo-300">Q.</span>
              <p className="font-medium">{q}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-10 border-t border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 no-print transition-colors duration-300">
        <p className="text-sm">Generated by PharmMentor Academic Intelligence</p>
        <p className="text-xs mt-1">PCI Syllabus Aligned | First Year B.Pharm Specialist</p>
      </footer>
    </div>
  );
};
