// 'use client';

// // import type { Metadata } from 'next';
// import './globals.css';
// import Navbar from '@/components/Navbar';

// // export const metadata: Metadata = {
// //   title: 'flexyz.work',
// //   description: '프리랜서 프로필 플랫폼',
// // };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="ko">
//       <body className="bg-gray-100">
//         <main>
//           {children}
//         </main>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/globals.css'; // Tailwind 적용
import { AuthProvider } from '@/context/AuthProvider';

export const metadata: Metadata = {
  title: 'flexyz.work - 프리랜서 플랫폼',
  description: '프리랜서를 검색하고, 원하는 프로젝트를 함께하세요!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="ko">
        <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
          <Navbar />
          <main className="container mx-auto min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
