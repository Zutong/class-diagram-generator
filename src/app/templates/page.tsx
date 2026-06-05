import Link from 'next/link';
import { seoTemplates } from '@/data/templates';

export const metadata = {
  title: "UML Class Diagram Templates | AI Diagram Generator",
  description: "Browse our collection of free UML class diagram templates. Use these starting points to generate e-commerce, library, and banking system architectures.",
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      <div className="bg-white shadow border-b border-gray-200 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-blue-600 hover:underline text-sm font-medium mb-2 inline-block">
            &larr; Back to Generator
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">UML Class Diagram Templates</h1>
          <p className="text-gray-500 mt-2">Explore our collection of AI-ready class diagram templates for software architecture.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seoTemplates.map((tmpl) => (
            <Link key={tmpl.slug} href={`/templates/${tmpl.slug}`} className="block">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 transition cursor-pointer h-full flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 mb-2">{tmpl.title}</h2>
                <p className="text-gray-600 text-sm flex-1">{tmpl.description}</p>
                <div className="mt-4 text-blue-600 text-sm font-semibold">View Template &rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}