import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  flashSuccess?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText,
  icon,
  flashSuccess = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Styles for tiers
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 select-none';
  
  let variantStyle = '';
  if (variant === 'primary') {
    if (disabled) {
      variantStyle = 'bg-[#00C4E8] text-[#080C14] opacity-40 cursor-not-allowed pointer-events-none';
    } else if (loading) {
      variantStyle = 'bg-[#00C4E8] text-[#080C14] pointer-events-none';
    } else {
      variantStyle = 'bg-[#00C4E8] text-[#080C14] hover:bg-[#22D3F0] hover:scale-[1.01] active:bg-[#00A8C7]';
    }
  } else if (variant === 'secondary') {
    if (disabled) {
      variantStyle = 'bg-transparent border border-[#1E2D45] text-[#E2E8F0] opacity-40 cursor-not-allowed pointer-events-none';
    } else if (loading) {
      variantStyle = 'bg-transparent border border-[#1E2D45] text-[#E2E8F0] pointer-events-none';
    } else {
      variantStyle = 'bg-transparent border border-[#1E2D45] text-[#E2E8F0] hover:bg-[#1A2540] hover:border-[#2A3A55] active:bg-[#0F1828]';
    }
  } else if (variant === 'destructive') {
    if (disabled) {
      variantStyle = 'bg-transparent border border-red-500/30 text-red-400 opacity-40 cursor-not-allowed pointer-events-none';
    } else if (loading) {
      variantStyle = 'bg-transparent border border-red-500/30 text-red-400 pointer-events-none';
    } else {
      variantStyle = 'bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 active:bg-red-500/20';
    }
  }

  // Size styles
  let sizeStyle = '';
  let iconSizeClass = '';
  if (size === 'large') {
    sizeStyle = 'px-6 py-3 text-[15px]';
    iconSizeClass = 'w-[18px] h-[18px]';
  } else if (size === 'medium') {
    sizeStyle = 'px-4 py-2.5 text-[14px]';
    iconSizeClass = 'w-[16px] h-[16px]';
  } else if (size === 'small') {
    sizeStyle = 'px-3 py-1.5 text-[13px]';
    iconSizeClass = 'w-[14px] h-[14px]';
  }

  const successFlashStyle = flashSuccess ? '!border-green-500/40 !border' : '';
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${successFlashStyle} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className={`animate-spin mr-2 ${iconSizeClass}`} />
      ) : (
        icon && <span className={`mr-2 flex items-center justify-center ${iconSizeClass}`}>{icon}</span>
      )}
      <span>{loading && loadingText ? loadingText : children}</span>
    </button>
  );
};

export default Button;
