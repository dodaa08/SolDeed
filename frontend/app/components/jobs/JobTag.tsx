"use client";

interface JobTagProps {
  text: string;
  type: "blue" | "green" | "gray";
  isDark?: boolean;
}

export function JobTag({ text, type, isDark = false }: JobTagProps) {
  const getColorClasses = (): string => {
    if (isDark) {
      switch(type) {
        case "blue": 
          return "bg-blue-900/40 text-blue-300";
        case "green": 
          return "bg-green-900/40 text-green-300";
        case "gray":
        default: 
          return "bg-gray-800 text-gray-300";
      }
    } else {
      switch(type) {
        case "blue": 
          return "bg-blue-50 text-blue-700";
        case "green": 
          return "bg-green-50 text-green-700";
        case "gray":
        default: 
          return "bg-gray-100 text-gray-700";
      }
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${getColorClasses()}`}>
      {text}
    </span>
  );
} 