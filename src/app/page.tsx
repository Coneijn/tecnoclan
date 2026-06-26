import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import SocialProof from '@/components/landing/SocialProof';
import ExperienceSection from '@/components/landing/ExperienceSection';
import WhatIsInside from '@/components/landing/WhatIsInside';
import CurriculumTimeline from '@/components/landing/CurriculumTimeline';
import FAQSection from '@/components/landing/FAQSection';
import PricingCheckoutCard from '@/components/landing/PricingCheckoutCard';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-clan-bg  text-clan-text antialiased">
      {/* 1. Navegación */}
      <Navbar />
      
      {/* 2. Gancho y Oferta Principal */}
      <HeroSection />
      
      {/* 3. Confianza Inmediata */}
      <SocialProof />
      
      {/* 4. Conexión Emocional */}
      <ExperienceSection />
      
      {/* 5. Justificación Lógica (Qué incluye) */}
      <WhatIsInside />
      
      {/* 6. El Mapa de Ruta (Curriculum) */}
      <CurriculumTimeline />
      
      {/* 7. Matador de Objeciones (Dudas) */}
      <FAQSection />
      
      {/* 8. El Cierre de Ventas (Checkout) */}
      <PricingCheckoutCard />
      
      {/* 9. Pie de página legal */}
      <Footer />
    </main>
  );
}