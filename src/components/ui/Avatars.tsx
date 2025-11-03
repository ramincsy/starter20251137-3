import React from 'react';

// Render the existing public SVG files as simple <img/> components so they
// look the same as the avatar assets in /public/avatars. This avoids any
// runtime network dependency and keeps the markup simple.

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { size?: number };

export function AvatarMale({ size = 64, className, ...rest }: ImgProps) {
  return (
    <img
      src="/avatars/male.svg"
      alt="male avatar"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`${className ?? ''} object-cover rounded-md`}
      {...rest}
    />
  );
}

export function AvatarFemale({ size = 64, className, ...rest }: ImgProps) {
  return (
    <img
      src="/avatars/female.svg"
      alt="female avatar"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`${className ?? ''} object-cover rounded-md`}
      {...rest}
    />
  );
}

export function AvatarAnonymous({ size = 64, className, ...rest }: ImgProps) {
  return (
    <img
      src="/avatars/anonymous.svg"
      alt="anonymous avatar"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`${className ?? ''} object-cover rounded-md`}
      {...rest}
    />
  );
}

export default AvatarAnonymous;
