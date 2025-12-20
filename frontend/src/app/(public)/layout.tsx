import Footer from "@/src/components/user/footer";
import { Navbar } from "@/src/components/user/navbar/navbar";
import UserProvider from "@/src/lib/userProvider";
import { Toaster } from "sonner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="w-[100%]">
        <UserProvider>{children}</UserProvider>
        <Toaster richColors position="top-right" />
      </main>
      <Footer />
    </>
  );
}
