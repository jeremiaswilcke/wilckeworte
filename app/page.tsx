import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { EquipmentSection } from '@/components/sections/EquipmentSection'
import { TeamSection } from '@/components/sections/TeamSection'
import { FinalCTASection } from '@/components/sections/FinalCTASection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <PricingSection />
      <EquipmentSection />
      <TeamSection />
      <FinalCTASection />
    </>
  )
}
