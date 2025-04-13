import AppBar from "../../_components/AppBar";
import Footer from "../../_components/Footer";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBar />
      {children}
      <Footer />
    </>
  );
}
