import React, { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' fill='%23e2e8f0'%3E%3Crect width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2394a3b8'%3EImage Not Available%3C/text%3E%3C/svg%3E";

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
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div
      className={`relative overflow-hidden h-48 sm:h-52 ${className}`}
      {...rest}
    >
      {children ? (
        children
      ) : imgSrc ? (
        <img
          src={imgSrc}
          alt={alt}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
    </div>
  );
};

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