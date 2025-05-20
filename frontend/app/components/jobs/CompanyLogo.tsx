"use client";

interface CompanyLogoProps {
  company: string;
  logoUrl?: string;
}

export function CompanyLogo({ company, logoUrl }: CompanyLogoProps) {
  // Use colored backgrounds with initials as logos
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const bgColors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-red-500', 'bg-yellow-500', 'bg-pink-500'
  ];
  
  const randomBgColor = bgColors[company.length % bgColors.length];

  return (
    <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center">
      {logoUrl ? (
        <img src={logoUrl} alt={company} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full ${randomBgColor} text-white flex items-center justify-center font-bold text-lg`}>
          {getInitials(company)}
        </div>
      )}
    </div>
  );
} 