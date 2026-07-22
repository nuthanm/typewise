import type { Metadata } from "next";
import "../styles/prototype.css";

export const metadata: Metadata = {
  title: "Typewise — Site Prototype",
  description: "Interactive prototype of the Typewise company directory.",
};

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
