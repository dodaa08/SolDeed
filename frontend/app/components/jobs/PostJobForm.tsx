"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useWallet } from '@solana/wallet-adapter-react';

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

export default function PostJobForm() {
  const router = useRouter();
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toString() || '';

  const [form, setForm] = useState({
    company_name: "",
    position: "",
    job_description: "",
    type: "Full-time",
    primary_tag: "",
    location: "",
    apply_url: "",
    logo: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url'>('upload');
  const [logoUrl, setLogoUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Basic validation
    if (!form.company_name || !form.position || !form.job_description || !form.type || !form.primary_tag || !form.location || !form.apply_url) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Prepare form data
    const body = new FormData();
    body.append("company_name", form.company_name);
    body.append("position", form.position);
    body.append("job_description", form.job_description);
    body.append("type", form.type);
    body.append("primary_tag", form.primary_tag);
    body.append("location", form.location);
    body.append("apply_url", form.apply_url);
    if (logoInputType === 'url' && logoUrl) {
      body.append('logo_url', logoUrl);
    } else if (form.logo) {
      body.append("logo", form.logo);
    }
    body.append("wallet_address", walletAddress);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Job posted successfully!");
        setForm({
          company_name: "",
          position: "",
          job_description: "",
          type: "Full-time",
          primary_tag: "",
          location: "",
          apply_url: "",
          logo: null,
        });
        router.push("/jobs");
      } else {
        setError(data.error || "Failed to post job.");
      }
    } catch (err) {
      setError("Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  // Theme-based classes
  const cardClass = isDark
    ? "bg-black/120 border border-gray-800 text-gray-100 shadow-2xl backdrop-blur-xl"
    : "bg-white/90 border border-gray-200 text-gray-900 shadow-xl";
  const inputClass = isDark
    ? "bg-gray-900/80 border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";
  const labelClass = isDark ? "text-gray-300" : "text-gray-700";
  const buttonClass =
    "w-full py-3 rounded-xl font-semibold mt-6 transition-all duration-200 bg-gradient-to-r from-blue-500/90 to-blue-500/90 text-white hover:from-blue-700/90 hover:to-blue-600/90 shadow-lg text-lg";

  return (
    <form onSubmit={handleSubmit} className={`max-w-2xl mx-auto p-8 rounded-3xl ${cardClass} relative`}>
      <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight">Post a Job</h2>
      <div className="w-16 h-1 mx-auto bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mb-8" />
      {error && <div className="mb-4 text-red-500 text-center font-medium">{error}</div>}
      {success && <div className="mb-4 text-green-500 text-center font-medium">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block mb-1 font-medium ${labelClass}`}>Company Name *</label>
          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 font-medium ${labelClass}`}>Position *</label>
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className={`block mb-1 font-medium ${labelClass}`}>Job Description *</label>
          <textarea
            name="job_description"
            value={form.job_description}
            onChange={handleChange}
            rows={4}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 font-medium ${labelClass}`}>Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={`block mb-1 font-medium ${labelClass}`}>Primary Tag *</label>
          <input
            name="primary_tag"
            value={form.primary_tag}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 font-medium ${labelClass}`}>Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          />
        </div>
        <div>
          <label className={`block mb-1 font-medium ${labelClass}`}>Apply URL *</label>
          <input
            name="apply_url"
            value={form.apply_url}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className={`block mb-1 font-medium ${labelClass}`}>Logo</label>
          <div className="flex gap-4 mb-2">
            <label>
              <input
                type="radio"
                name="logoInputType"
                value="upload"
                checked={logoInputType === 'upload'}
                onChange={() => setLogoInputType('upload')}
              /> Upload
            </label>
            <label>
              <input
                type="radio"
                name="logoInputType"
                value="url"
                checked={logoInputType === 'url'}
                onChange={() => setLogoInputType('url')}
              /> Paste URL
            </label>
          </div>
          {logoInputType === 'upload' ? (
            <input
              name="logo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            />
          ) : (
            <input
              name="logoUrl"
              type="url"
              placeholder="https://example.com/logo.png"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 ${inputClass}`}
            />
          )}
        </div>
      </div>
      <button type="submit" className={buttonClass} disabled={loading}>
        {loading ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
} 