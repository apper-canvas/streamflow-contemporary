import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '@/components/organisms/Header';
import MobileNav from '@/components/organisms/MobileNav';

const Layout = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isWatchPage = location.pathname.startsWith('/watch');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isWatchPage) {
    return (
      <div className="h-screen overflow-hidden">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header isScrolled={isScrolled} />
      
      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout;