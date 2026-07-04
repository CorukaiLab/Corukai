import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoruKai - Leer deberia sentirse bien",
  description:
    "CoruKai es una experiencia cultural para descubrir libros, historias y emociones desde la curiosidad, la calma y la sensibilidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
