import type { ImgHTMLAttributes } from "react";
import { asset } from "@/lead";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; fill?: boolean; priority?: boolean };

export default function Image({ src, fill, priority, sizes, style, alt = "", ...resto }: Props) {
  return (
    <img
      {...resto}
      alt={alt}
      src={asset(src)}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", color: "transparent", ...style } : style}
    />
  );
}
