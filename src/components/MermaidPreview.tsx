"use client";

import { useEffect, useState, useId } from "react";
import mermaid from "mermaid";
import { Download, AlertCircle, Image as ImageIcon } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

interface MermaidPreviewProps {
  code: string;
  onError: (error: string) => void;
}

export default function MermaidPreview({ code, onError }: MermaidPreviewProps) {
  const [svgContent, setSvgContent] = useState<string>("");
  const uniqueId = useId().replace(/:/g, ""); // React 18 string safe id

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        if (!code) {
           setSvgContent("");
           return;
        }
        
        // Use a static-like ID per component instance so mermaid has a clean target
        const mermaidId = `mermaid-svg-${uniqueId}`;
        
        // This parses and returns the SVG string synchronously in V10+ mostly
        const { svg } = await mermaid.render(mermaidId, code);
        
        if (isMounted) {
          setSvgContent(svg);
          onError(""); 
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Mermaid Render Error:", err);
          onError(err?.message || "Syntax error in Mermaid code");
          setSvgContent("");
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [code, onError, uniqueId]);

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class-diagram.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Use 2x scale for high resolution/retina quality
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "class-diagram.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPNG}
            disabled={!svgContent}
            className="text-sm disabled:opacity-50 text-gray-600 font-medium hover:text-green-600 px-3 py-1 border rounded hover:border-green-600 transition flex items-center gap-1"
          >
            <ImageIcon className="w-4 h-4" />
            Download PNG
          </button>
          <button
            onClick={handleDownloadSVG}
            disabled={!svgContent}
            className="text-sm disabled:opacity-50 text-gray-600 font-medium hover:text-blue-600 px-3 py-1 border rounded hover:border-blue-600 transition flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Download SVG
          </button>
        </div>
      </div>

      <div
        className="flex-1 w-full flex items-center justify-center overflow-auto bg-gray-50 border border-gray-200 border-dashed rounded-lg p-4"
      >
        {svgContent ? (
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        ) : (
          <div className="text-gray-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Waiting for valid Mermaid code...
          </div>
        )}
      </div>
    </div>
  );
}