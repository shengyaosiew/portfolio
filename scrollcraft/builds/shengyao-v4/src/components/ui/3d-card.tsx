// Adapted from Aceternity UI "3D Card Effect" (ui.aceternity.com/components/3d-card-effect).
// Changes: no cn helper, tilt only on fine pointers and never under reduced
// motion, softer tilt (/32 instead of /25), no forced 24rem box.
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMedia, useReducedMotion } from "../../lib/hooks";

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined);

export const CardContainer = ({ children, className = "", containerClassName = "" }: { children?: React.ReactNode; className?: string; containerClassName?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();
  const on = fine && !reduce;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!on || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 32;
    const y = (e.clientY - top - height / 2) / 32;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };
  const handleMouseLeave = () => {
    setIsMouseEntered(false);
    if (containerRef.current) containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered && on, setIsMouseEntered]}>
      <div className={`flex items-center justify-center ${containerClassName}`} style={{ perspective: "1000px" }}>
        <div
          ref={containerRef}
          onMouseEnter={() => setIsMouseEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative flex items-center justify-center transition-all duration-200 ease-linear ${className}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d] ${className}`}>{children}</div>
);

export const CardItem = ({
  as: Tag = "div",
  children,
  className = "",
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: unknown;
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag ref={ref} className={`transition duration-200 ease-linear ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) throw new Error("useMouseEnter must be used within a CardContainer");
  return context;
};
