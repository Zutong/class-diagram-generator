"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import MermaidPreview from "@/components/MermaidPreview";
import { Sparkles, Copy, UserCircle2 } from "lucide-react";

const TEMPLATES = [
  {
    label: "📚 Library System",
    prompt: "A library management system where a Member borrows a Book, and Librarians manage inventory.",
  },
  {
    label: "🛒 E-Commerce",
    prompt: "E-commerce classes: Customer, Order, ShoppingCart, Product, and Payment.",
  },
  {
    label: "🏦 ATM Withdraw",
    prompt: "ATM system: Customer, BankCard, Account, and Transaction classes.",
  },
];

const INITIAL_CODE = `classDiagram
    class BankAccount {
        +String owner
        +BigDecimal balance
        +deposit(amount)
        +withdrawal(amount)
    }`;

const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export default function Home() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState(INITIAL_CODE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyText, setCopyText] = useState("📋 Copy Code");
  
  // To track errors for the fallback loop
  const [renderError, setRenderError] = useState("");

  const handleGenerate = async (retryError?: string) => {
    if (!prompt && !retryError) {
      alert("Please describe your logic or paste code first.");
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt,
          errorFallback: retryError || null,
          previousCode: retryError ? code : null 
        }),
      });

      const data = await res.json();
      
      if (data.code) {
        setCode(data.code);
      } else {
        alert("Failed to generate code.");
      }
    } catch (err) {
      console.error(err);
      alert("Network or API error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyText("✅ Copied!");
      setTimeout(() => setCopyText("📋 Copy Code"), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Class Diagram Generator</h1>
            <p className="text-sm text-gray-500 mt-1">Text & Code to UML powered by Mermaid.js</p>
          </div>
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Hey, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-800 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium text-sm"
              >
                <GoogleIcon />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Input & Settings */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Prompt Box */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  1. Describe / Paste Code
                </h2>
              </div>
              
              {/* Quick Templates */}
              <div className="flex flex-wrap gap-2 mb-3">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => setPrompt(tmpl.prompt)}
                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2 py-1.5 rounded transition border border-indigo-100"
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Describe your logic in plain text, OR paste your Java/Python code here..."
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full mt-3 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium flex justify-center items-center gap-2 disabled:bg-blue-400"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? "Generating..." : "Generate Class Diagram"}
              </button>
            </div>

            {/* Code Editor Box */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  2. Edit Mermaid Code
                </h2>
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-500 hover:text-gray-800 font-medium transition cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3 h-3"/> {copyText}
                </button>
              </div>

              {renderError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md flex flex-col gap-2">
                  <span className="font-semibold">⚠️ Mermaid Syntax Error:</span>
                  <span className="font-mono text-[10px] break-all">{renderError}</span>
                  <button 
                    onClick={() => handleGenerate(renderError)}
                    disabled={isGenerating}
                    className="bg-red-100 hover:bg-red-200 text-red-800 py-1.5 rounded transition font-medium text-center mt-1 disabled:opacity-50"
                  >
                    {isGenerating ? "Fixing..." : "Ask AI to Auto-Fix"}
                  </button>
                </div>
              )}

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full flex-1 border border-gray-300 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-gray-500 outline-none bg-gray-50"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Right Panel: Diagram Preview */}
          <MermaidPreview code={code} onError={setRenderError} />
          
        </div>
      </main>
    </div>
  );
}
