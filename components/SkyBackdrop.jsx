/**
 * SkyBackdrop
 * -----------
 * Renders ONLY the uploaded scenic image as the background — no decorative
 * clouds, mountains, birds, particles or gradients on top. The image is
 * displayed exactly as uploaded via the `.sky-bg` class (defined in
 * globals.css).
 */
export default function SkyBackdrop() {
  return <div className="absolute inset-0 -z-10 sky-bg" />
}
