// src/components/common/Card/Card.tsx
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

type CardCompound = React.FC<CardProps> & {
  Image: React.FC<CardImageProps>;
  Content: React.FC<CardSectionProps>;
  Footer: React.FC<CardSectionProps>;
};

const CardRoot: React.FC<CardProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <div
      className={`group flex h-full flex-col rounded-xl bg-[var(--white)] shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out border border-[var(--b2-soft)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/* IMAGE */
const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  children,
  className = "",
  ...rest
}) => (
  <div
    className={`relative overflow-hidden h-48 sm:h-52 ${className}`}
    {...rest}
  >
    {children ? (
      children
    ) : src ? (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    ) : null}
  </div>
);

/* CONTENT */
const CardContent: React.FC<CardSectionProps> = ({
  children,
  className = "",
  ...rest
}) => (
  <div
    className={`flex flex-1 flex-col p-4 space-y-2 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

/* FOOTER */
const CardFooter: React.FC<CardSectionProps> = ({
  children,
  className = "",
  ...rest
}) => (
  <div
    className={`mt-auto p-4 pt-0 ${className}`}
    {...rest}
  >
    {children}
  </div>
);

const Card = CardRoot as CardCompound;
Card.Image = CardImage;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;