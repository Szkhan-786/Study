
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="max-w-4xl mx-auto px-4 pb-12 no-print">
      <aside className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl transition-colors duration-300">
        <div className="font-bold text-slate-900 dark:text-white text-lg">Contact</div>
        <div className="mt-[10px] space-y-3">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <i className="fa-solid fa-envelope w-5 text-emerald-600"></i>
            <a href="mailto:szcamps@gmail.com" className="hover:text-emerald-600 transition-colors">szcamps@gmail.com</a>
          </div>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <i className="fa-brands fa-github w-5 text-slate-900 dark:text-white"></i>
            <a href="https://github.com/szkhan7860" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">github.com/szkhan7860</a>
          </div>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <i className="fa-brands fa-instagram w-5 text-pink-500"></i>
            <a href="https://www.instagram.com/Shahnawaz._.2006/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">@Shahnawaz._.2006</a>
          </div>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <i className="fa-brands fa-telegram w-5 text-blue-400"></i>
            <a href="http://telegram.me/Sukuna_Verified" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Sukuna_Verified</a>
          </div>
        </div>
        <div className="flex gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <a href="https://github.com/szkhan7860" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-emerald-600 transition-all">
            <i className="fa-brands fa-github text-xl"></i>
          </a>
          <a href="https://www.instagram.com/Shahnawaz._.2006/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-pink-500 transition-all">
            <i className="fa-brands fa-instagram text-xl"></i>
          </a>
          <a href="http://telegram.me/Sukuna_Verified" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-blue-400 transition-all">
            <i className="fa-brands fa-telegram text-xl"></i>
          </a>
        </div>
        <div className="mt-8 text-center text-slate-400 dark:text-slate-500 text-xs">
          <p>© 2024 PharmMentor Academic Intelligence. All rights reserved.</p>
          <p className="mt-1 font-medium">B.Pharm Mentor & Academic Hub</p>
        </div>
      </aside>
    </footer>
  );
};
