import Footer from "@/src/components/public/footer";
import RouteLoader from "@/src/components/ui/RouteLoader";
import { Navbar } from "@/src/components/public/navbar/navbar";
import AuthLoginRedirectWrapper from "@/src/lib/authWrapper";
import UserProvider from "@/src/lib/userProvider";
import { Toaster } from "sonner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteLoader />
      <Navbar />
      <main className="w-[100%]">
        <UserProvider>{children}</UserProvider>
        <Toaster richColors position="top-right" />
      </main>
      <Footer />
    </>
  );
}
