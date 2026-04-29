export const metadata = {
  title: "Admin Dashboard | Wedding Website",
  description: "Manage wedding website content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
