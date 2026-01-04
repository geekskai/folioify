import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <a href=" " target="_blank" rel="noopener noreferrer"> 
        <img src="https://img.aitoolshood.com/8f8751eebc084fc5a3006212f97ebd5a.png" alt="aitoolshood.com" style="height: 54px; width: auto;"/>
      </a>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
