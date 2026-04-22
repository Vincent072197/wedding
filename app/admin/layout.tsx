export const metadata = {
  title: "Admin Dashboard | Wedding Website",
  description: "Manage wedding website content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <header className="bg-white border-b border-stone-200 py-4 px-6 shadow-sm">
        <h1 className="font-serif text-2xl text-primary font-bold">Admin Dashboard</h1>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}
