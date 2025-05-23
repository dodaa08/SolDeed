"use client";

import PostJobForm from '@/app/components/jobs/PostJobForm';
import { useTheme } from 'next-themes';

export default function PostJobPage() {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <main className={isDark ? 'bg-black/120 min-h-screen py-12' : 'bg-white min-h-screen py-12'}>
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        <PostJobForm />
      </div>
    </main>
  );
} 