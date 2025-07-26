import Footer from "@/components/Footer/Footer";
import Header from "@/components/shared/header";

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="wrapper flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
