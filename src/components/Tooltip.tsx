import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, text, position = "top" }: TooltipProps) {
  const [show, setShow] = useState(false);

  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${posClasses[position]} pointer-events-none animate-fade-up`}>
          <div className="brut-tag bg-ink text-paper whitespace-nowrap text-[10px] px-2 py-1 border-2 border-ink shadow-[4px_4px_0_0_var(--brand-orange)]">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}
