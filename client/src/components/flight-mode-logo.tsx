interface FlightModeLogoProps {
  className?: string;
  variant?: 'full' | 'symbol' | 'text';
  theme?: 'light' | 'dark';
}

export default function FlightModeLogo({ 
  className = "h-10 w-auto", 
  variant = 'full',
  theme = 'light'
}: FlightModeLogoProps) {
  const goldColor = theme === 'dark' ? '#D4AF37' : '#B8860B';
  const navyColor = theme === 'dark' ? '#F5F5DC' : '#1B1B3A';
  
  if (variant === 'symbol') {
    return (
      <svg 
        viewBox="0 0 80 80" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Oval background */}
        <ellipse 
          cx="40" 
          cy="40" 
          rx="35" 
          ry="30" 
          fill="none" 
          stroke={goldColor} 
          strokeWidth="2.5"
        />
        
        {/* Airplane symbol */}
        <g transform="translate(40, 40)">
          {/* Main fuselage */}
          <path
            d="M -12 0 L 15 -1 L 15 1 L -12 0 Z"
            fill={goldColor}
          />
          
          {/* Wings */}
          <path
            d="M -8 0 L -2 -8 L 4 -6 L -2 0 L 4 6 L -2 8 Z"
            fill={goldColor}
          />
          
          {/* Tail */}
          <path
            d="M 12 -1 L 18 -4 L 18 4 L 12 1 Z"
            fill={goldColor}
          />
          
          {/* Wing details */}
          <circle cx="-4" cy="0" r="1" fill={navyColor} opacity="0.3"/>
          <circle cx="2" cy="0" r="0.8" fill={navyColor} opacity="0.3"/>
        </g>
      </svg>
    );
  }
  
  if (variant === 'text') {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={`font-serif font-bold text-2xl leading-tight`} style={{ color: navyColor }}>
          FLIGHT MODE
        </span>
        <span className={`font-sans font-medium text-xs tracking-[0.2em] -mt-1`} style={{ color: goldColor }}>
          COMPETITIONS
        </span>
      </div>
    );
  }
  
  // Full logo with symbol and text
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Symbol */}
      <svg 
        viewBox="0 0 60 60" 
        className="h-10 w-10 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Oval background */}
        <ellipse 
          cx="30" 
          cy="30" 
          rx="26" 
          ry="22" 
          fill="none" 
          stroke={goldColor} 
          strokeWidth="2"
        />
        
        {/* Airplane symbol */}
        <g transform="translate(30, 30)">
          {/* Main fuselage */}
          <path
            d="M -9 0 L 11 -0.8 L 11 0.8 L -9 0 Z"
            fill={goldColor}
          />
          
          {/* Wings */}
          <path
            d="M -6 0 L -1.5 -6 L 3 -4.5 L -1.5 0 L 3 4.5 L -1.5 6 Z"
            fill={goldColor}
          />
          
          {/* Tail */}
          <path
            d="M 9 -0.8 L 13.5 -3 L 13.5 3 L 9 0.8 Z"
            fill={goldColor}
          />
          
          {/* Wing details */}
          <circle cx="-3" cy="0" r="0.8" fill={navyColor} opacity="0.3"/>
          <circle cx="1.5" cy="0" r="0.6" fill={navyColor} opacity="0.3"/>
        </g>
      </svg>
      
      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className={`font-serif font-bold text-xl`} style={{ color: navyColor }}>
          FLIGHT MODE
        </span>
        <span className={`font-sans font-medium text-[10px] tracking-[0.15em] -mt-0.5`} style={{ color: goldColor }}>
          COMPETITIONS
        </span>
      </div>
    </div>
  );
}