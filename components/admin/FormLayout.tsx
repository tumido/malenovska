"use client";

import { useState } from "react";

interface Tab {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface FormLayoutProps {
  title: string;
  tabs: Tab[];
  onSubmit: () => void;
  onCancel: () => void;
  saving?: boolean;
}

const FormLayout = ({ title, tabs, onSubmit, onCancel, saving }: FormLayoutProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key ?? "");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      {tabs.length > 1 && (
        <div className="border-b border-gray-200">
          <nav className="flex gap-0 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {tabs.find((t) => t.key === activeTab)?.content}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={saving}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Ukládání…" : "Uložit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Zrušit
        </button>
      </div>
    </div>
  );
};

export default FormLayout;
