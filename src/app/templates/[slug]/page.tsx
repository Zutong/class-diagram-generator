import { Metadata } from 'next';
import Link from 'next/link';
import { seoTemplates } from '@/data/templates';
import { notFound } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export function generateStaticParams() {
  return seoTemplates.map((t) => ({
    slug: t.slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const template = seoTemplates.find((t) => t.slug === params.slug);
  if (!template) return {};

  return {
    title: `${template.title} | AI UML Generator`,
    description: template.description,
    keywords: [template.title, "UML", "Class Diagram", "Mermaid.js"],
  };
}

export default function TemplateDetail({ params }: { params: { slug: string } }) {
  const template = seoTemplates.find((t) => t.slug === params.slug);
  
  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      <div className="bg-white shadow border-b border-gray-200 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/templates" className="text-blue-600 hover:underline text-sm font-medium mb-2 inline-block">
            &larr; Back to Templates
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{template.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About this Architecture</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {template.seoContent}
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              AI Generation Prompt
            </h3>
            <code className="text-gray-800 font-mono text-sm block bg-white p-4 border rounded">
              {template.prompt}
            </code>
          </div>

          <div className="flex justify-center mt-8">
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-5 h-5" />
              Build this Diagram in AI Generator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}