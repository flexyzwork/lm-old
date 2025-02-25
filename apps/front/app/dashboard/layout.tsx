export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <Navbar />  ✅ 대시보드 전용 네비게이션 바 (한 번만 정의) */}
      <main className="p-6">{children}</main>  {/* ✅ 여기에 개별 페이지가 렌더링됨 */}
    </div>
  );
}