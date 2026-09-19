import RingConfigurator from '@/components/RingConfigurator';
import StoreSections from '@/components/StoreSections';
import Faq from '@/components/Faq';

export const metadata = {
  title: 'Ring Builder | Nexora Jewellers',
  description: 'Design your custom lab-grown or natural diamond ring in 3D.',
};

export default function BuilderPage() {
  return (
    <main className="min-h-screen pt-[70px] lg:pt-[85px] bg-[#faf9f8]">
      <RingConfigurator />
      
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <StoreSections />
      </div>
      
      <Faq />
    </main>
  );
}
