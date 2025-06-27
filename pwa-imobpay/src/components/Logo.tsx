import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'sidebar';
  className?: string;
}

const sizeMap = {
  sm: 'h-7',
  md: 'h-10',
  sidebar: '',
  lg: 'h-48',
};

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const style: React.CSSProperties = size === 'sidebar'
    ? { height: '80px', width: '120px', display: 'block', borderRadius: '1rem', objectFit: 'cover' as React.CSSProperties['objectFit'], objectPosition: 'center' as React.CSSProperties['objectPosition'] }
    : { display: 'block' };
  return (
    <img
      src="/ImobPayLogo.png"
      alt="ImobPay Logo"
      className={`${sizeMap[size]} w-auto rounded-2xl ${className}`}
      style={style}
    />
  );
};

export default Logo; 