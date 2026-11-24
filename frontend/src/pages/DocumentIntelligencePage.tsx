import React, { useState } from 'react';
import { useAuth } from '../store/authContext';
import api from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const DocumentIntelligencePage: React.FC = () => {
  const { t, language } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/ai/document-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      alert("Error analyzing document: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("AI Village Document Intelligence", "ఏఐ పత్రాల విశ్లేషణ & సమాచార గుర్తింపు")}
          </h1>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
            OCR & PDF Parsing
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t(
            "Upload government circulars, Gram Sabha notices, or scheme guidelines to extract key dates, plain-language summaries, and action points.",
            "ప్రభుత్వ జీ.ఓ.లు, గ్రామసభ తీర్మానాలు లేదా పథకాల నిబంధనలను అప్‌లోడ్ చేసి ముఖ్యమైన తేదీలు మరియు సారాంశాన్ని పొందండి."
          )}
        </p>
      </div>

      {/* Upload Zone */}
      <Card>
        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
          <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">
            {t("Upload Government Notice, Minutes, or Circular (PDF / Image / TXT)", "ప్రభుత్వ పత్రాన్ని ఇక్కడ అప్‌లోడ్ చేయండి")}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Supports official Gram Panchayat resolutions, water supply notifications, and tender notices.
          </p>

          <input
            type="file"
            id="doc-upload"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="doc-upload" className="cursor-pointer inline-block">
            <span className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-4 py-2 border border-slate-300 rounded-lg text-xs hover:bg-slate-50 shadow-xs">
              <FileText className="w-4 h-4 text-[#166534]" />
              {selectedFile ? selectedFile.name : t("Select Document File", "ఫైల్‌ను ఎంచుకోండి")}
            </span>
          </label>

          {selectedFile && (
            <div className="mt-4">
              <Button
                onClick={handleUploadAndAnalyze}
                isLoading={uploading}
                size="sm"
                icon={<Sparkles className="w-4 h-4" />}
              >
                {t("Extract & Analyze with AI", "ఏఐ ద్వారా విశ్లేషించండి")}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {t("Document Extraction & Insights", "విశ్లేషణ ఫలితాలు")}
            </h2>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {result.confidence}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summaries */}
            <Card title={t("Plain-Language Plain-Text Summary", "సులభ శైలిలో సారాంశం")}>
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-950 font-medium">
                  <strong>English:</strong> {result.summary}
                </div>
                {result.summary_te && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
                    <strong>తెలుగు:</strong> {result.summary_te}
                  </div>
                )}
              </div>
            </Card>

            {/* Extracted Dates & Key Decisions */}
            <Card title={t("Extracted Deadlines & Action Items", "గుర్తించిన తేదీలు & బాధ్యతలు")}>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">
                    📅 {t("Key Dates & Deadlines:", "ముఖ్యమైన తేదీలు:")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.important_dates.map((d: string, idx: number) => (
                      <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono font-semibold">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">
                    ✓ {t("Key Resolutions Identified:", "ఆమోదించిన నిర్ణయాలు:")}
                  </span>
                  <ul className="space-y-1 text-slate-700">
                    {result.decisions_found.map((dec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Raw Text Preview */}
          <Card title={t("Extracted Text Preview", "గుర్తించిన మూల పాఠం (Preview)")}>
            <pre className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
              {result.extracted_text_preview}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
};
