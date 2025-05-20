"use client";

interface JobTagProps {
  text: string;
  type: "blue" | "green" | "gray";
}

export function JobTag({ text, type }: JobTagProps) {
  const getColorClasses = (): string => {
    switch(type) {
      case "blue": 
        return "bg-blue-50 text-blue-700";
      case "green": 
        return "bg-green-50 text-green-700";
      case "gray":
      default: 
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${getColorClasses()}`}>
      {text}
    </span>
  );
} 