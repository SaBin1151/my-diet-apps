import type { Metadata } from "next";
import Layout from "../components/Layout"; // [중요] 방금 만든 컴포넌트 불러오기
import "./globals.css";

export const metadata: Metadata = {
  title: "Diet Planner",
  description: "Minimalist Diet Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Layout 컴포넌트로 앱 전체를 감쌉니다 */}
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}