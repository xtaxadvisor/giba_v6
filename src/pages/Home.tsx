import { Hero } from '../components/home/Hero';
import { Services } from '../components/home/Services';
import { Features } from '../components/home/Features';
import { FeatureShowcase } from '../components/home/FeatureShowcase';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { Testimonials } from '../components/home/Testimonials';
import { Subscriptions } from '../components/home/Subscriptions';
import { AboutUs } from '../components/home/AboutUs';
import { Contact } from '../components/home/Contact';
import { Header } from '../components/layout/Header';
import { AIAssistantWidget } from '../components/ai/AIAssistantWidget';

function Home() {
  return (
    <>
      {(() => {
  try {
    return <Header />;
  } catch (err) {
    console.error('Header must be used within an AuthProvider.', err);
    return null;
  }
})()}

      <main>
        {(() => {
          try {
            return <Hero />;
          } catch (err) {
            console.error('Hero must be used within AuthProvider.', err);
            return null;
          }
        })()}
        
        <Services />
        {(() => {
          try {
            return <Features />;
          } catch (err) {
            console.error('Features must be used within AuthProvider.', err);
            return null;
          }
        })()}
        <FeatureShowcase />
        
        {(() => {
          try {
            return <Subscriptions />;
          } catch (err) {
            console.error('Subscriptions must be used within AuthProvider.', err);
            return null;
          }
        })()}

        <TrustIndicators />
        <Testimonials />
        <AboutUs />
        <Contact />
      </main>
      <AIAssistantWidget />
    </>
  );
}

export default Home;