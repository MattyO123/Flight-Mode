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
          {/* Main fuselage - longer and more prominent */}
          <ellipse cx="0" cy="0" rx="18" ry="2.5" fill={goldColor} />
          
          {/* Nose cone */}
          <path d="M 18 0 L 22 -1 L 22 1 Z" fill={goldColor} />
          
          {/* Main wings - larger and more airplane-like */}
          <path
            d="M -8 0 L -12 -12 L 0 -8 L 8 -4 L 0 0 L 8 4 L 0 8 L -12 12 Z"
            fill={goldColor}
          />
          
          {/* Tail wings */}
          <path
            d="M -15 0 L -20 -6 L -16 -3 L -15 0 L -16 3 L -20 6 Z"
            fill={goldColor}
          />
          
          {/* Wing struts for detail */}
          <line x1="-4" y1="0" x2="-4" y2="-6" stroke={navyColor} strokeWidth="1" opacity="0.4"/>
          <line x1="-4" y1="0" x2="-4" y2="6" stroke={navyColor} strokeWidth="1" opacity="0.4"/>
          <line x1="4" y1="0" x2="4" y2="-3" stroke={navyColor} strokeWidth="1" opacity="0.4"/>
          <line x1="4" y1="0" x2="4" y2="3" stroke={navyColor} strokeWidth="1" opacity="0.4"/>
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
          {/* Main fuselage - longer and more prominent */}
          <ellipse cx="0" cy="0" rx="14" ry="2" fill={goldColor} />
          
          {/* Nose cone */}
          <path d="M 14 0 L 17 -0.8 L 17 0.8 Z" fill={goldColor} />
          
          {/* Main wings - larger and more airplane-like */}
          <path
            d="M -6 0 L -9 -9 L 0 -6 L 6 -3 L 0 0 L 6 3 L 0 6 L -9 9 Z"
            fill={goldColor}
          />
          
          {/* Tail wings */}
          <path
            d="M -11 0 L -15 -4.5 L -12 -2.5 L -11 0 L -12 2.5 L -15 4.5 Z"
            fill={goldColor}
          />
          
          {/* Wing struts for detail */}
          <line x1="-3" y1="0" x2="-3" y2="-4.5" stroke={navyColor} strokeWidth="0.8" opacity="0.4"/>
          <line x1="-3" y1="0" x2="-3" y2="4.5" stroke={navyColor} strokeWidth="0.8" opacity="0.4"/>
          <line x1="3" y1="0" x2="3" y2="-2.5" stroke={navyColor} strokeWidth="0.8" opacity="0.4"/>
          <line x1="3" y1="0" x2="3" y2="2.5" stroke={navyColor} strokeWidth="0.8" opacity="0.4"/>
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