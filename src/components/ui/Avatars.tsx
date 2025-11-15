import React from 'react';
import { MaleAvatarSvg, FemaleAvatarSvg, AnonymousAvatarSvg, MaleAvatar2, FemaleAvatar2 } from './AvatarSvgs';

/**
 * Avatar Components - Using SVG Components
 * 
 * Original Avatars (Simple SVG):
 * - <AvatarMale /> - Simple blue male avatar
 * - <AvatarFemale /> - Simple pink female avatar
 * - <AvatarAnonymous /> - Simple gray anonymous avatar
 * 
 * New Avatars (Custom SVG):
 * - <AvatarMale2 /> - Modern blue male avatar
 * - <AvatarFemale2 /> - Modern pink female avatar
 * 
 * All SVG definitions are in AvatarSvgs.tsx - edit that file to customize colors and shapes.
 * Custom SVGs are in /public/avatars/custom/
 */

type AvatarProps = React.SVGProps<SVGSVGElement> & { size?: number; className?: string };
type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { size?: number };

/**
 * Male Avatar (Original - Simple)
 * 
 * @param size - Avatar size in pixels (default: 64)
 * @param className - Additional CSS classes
 */
export function AvatarMale({ size = 64, className = '', ...rest }: AvatarProps) {
  return (
    <MaleAvatarSvg
      size={size}
      className={className}
      {...rest}
    />
  );
}

/**
 * Female Avatar (Original - Simple)
 * 
 * @param size - Avatar size in pixels (default: 64)
 * @param className - Additional CSS classes
 */
export function AvatarFemale({ size = 64, className = '', ...rest }: AvatarProps) {
  return (
    <FemaleAvatarSvg
      size={size}
      className={className}
      {...rest}
    />
  );
}

/**
 * Anonymous Avatar (Original - Simple)
 * 
 * @param size - Avatar size in pixels (default: 64)
 * @param className - Additional CSS classes
 */
export function AvatarAnonymous({ size = 64, className = '', ...rest }: AvatarProps) {
  return (
    <AnonymousAvatarSvg
      size={size}
      className={className}
      {...rest}
    />
  );
}

/**
 * Male Avatar 2 (Modern Custom)
 * 
 * @param size - Avatar size in pixels (default: 64)
 * @param className - Additional CSS classes
 */
export function AvatarMale2({ size = 64, className = '', ...rest }: ImgProps) {
  return (
    <MaleAvatar2
      size={size}
      className={className}
      {...rest}
    />
  );
}

/**
 * Female Avatar 2 (Modern Custom)
 * 
 * @param size - Avatar size in pixels (default: 64)
 * @param className - Additional CSS classes
 */
export function AvatarFemale2({ size = 64, className = '', ...rest }: ImgProps) {
  return (
    <FemaleAvatar2
      size={size}
      className={className}
      {...rest}
    />
  );
}

export default AvatarAnonymous;
