/**
 * Avatar SVG Components - All in One Place
 * 
 * This file contains all avatar SVG definitions in React format.
 * You can easily modify colors, shapes, and styles here.
 * 
 * Custom avatars are loaded from /public/avatars/custom/
 * 
 * Colors:
 * - Male: #2B6CB0 (Blue)
 * - Female: #D53F8C (Pink)
 * - Anonymous: #A0AEC0 (Gray)
 * - Male2: #1976D2 (Modern Blue)
 * - Female2: #C2185B (Modern Pink)
 */

import React from 'react';

type SvgProps = React.SVGProps<SVGSVGElement> & { size?: number; className?: string };
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { size?: number };

/**
 * Male Avatar - Blue theme
 * Background: #E6F0FF (Light Blue)
 * Head: #2B6CB0 (Dark Blue)
 */
export function MaleAvatarSvg({ size = 256, className = '', ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      {...props}
    >
      <rect width="100%" height="100%" fill="#E6F0FF" rx="20" />
      <circle cx="128" cy="88" r="44" fill="#2B6CB0" />
      <rect x="56" y="150" width="144" height="70" rx="18" fill="#2B6CB0" />
      <rect x="76" y="170" width="104" height="10" rx="5" fill="#E6F0FF" opacity="0.9" />
    </svg>
  );
}

/**
 * Female Avatar - Pink theme
 * Background: #FFF5F8 (Light Pink)
 * Head: #D53F8C (Dark Pink)
 */
export function FemaleAvatarSvg({ size = 256, className = '', ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      {...props}
    >
      <rect width="100%" height="100%" fill="#FFF5F8" rx="20" />
      <circle cx="128" cy="84" r="44" fill="#D53F8C" />
      <rect x="56" y="150" width="144" height="70" rx="18" fill="#D53F8C" />
      <rect x="76" y="170" width="104" height="10" rx="5" fill="#FFF5F8" opacity="0.9" />
    </svg>
  );
}

/**
 * Anonymous Avatar - Gray theme
 * Background: #F0F0F0 (Light Gray)
 * Head: #A0AEC0 (Medium Gray)
 */
export function AnonymousAvatarSvg({ size = 256, className = '', ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      {...props}
    >
      <rect width="100%" height="100%" fill="#F0F0F0" rx="20" />
      <circle cx="128" cy="96" r="44" fill="#A0AEC0" />
      <rect x="56" y="160" width="144" height="40" rx="10" fill="#CBD5E0" />
    </svg>
  );
}

/**
 * Male Avatar 2 - Modern Blue theme
 * Loads from /public/avatars/custom/male2.svg
 */
export function MaleAvatar2({ size = 256, className = '', ...props }: ImgProps) {
  return (
    <img
      src="/avatars/custom/male2.svg"
      alt="male avatar 2"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`${className ?? ''} object-cover`}
      {...props}
    />
  );
}

/**
 * Female Avatar 2 - Modern Pink theme
 * Loads from /public/avatars/custom/female2.svg
 */
export function FemaleAvatar2({ size = 256, className = '', ...props }: ImgProps) {
  return (
    <img
      src="/avatars/custom/female2.svg"
      alt="female avatar 2"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`${className ?? ''} object-cover`}
      {...props}
    />
  );
}

export default {
  MaleAvatarSvg,
  FemaleAvatarSvg,
  AnonymousAvatarSvg,
  MaleAvatar2,
  FemaleAvatar2,
};
