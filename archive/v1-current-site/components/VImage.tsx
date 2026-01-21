"use client";
import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "alt"> & { alt: string };

export default function VImage(props: Props) {
  if (!props.alt || props.alt.trim().length < 5) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("VImage requires descriptive alt text (≥ 5 chars).", props.src);
    }
  }
  return <Image {...props} />;
}

