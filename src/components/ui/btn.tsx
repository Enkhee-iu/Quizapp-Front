import React from "react";

type ButtonSecondaryProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export const ButtonSecondary = ({
  children,
  onClick,
  disabled,
  className = "",
}: ButtonSecondaryProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white 
        hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </button>
  );
};
