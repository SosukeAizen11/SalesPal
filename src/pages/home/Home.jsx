import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HeroSection from './sections/HeroSection';
import WhySalesPal from './sections/WhySalesPal';
import ModulesSection from './sections/ModulesSection';
import ModularApproach from './sections/ModularApproach';
import PricingSection from './sections/PricingSection';
import HowItWorks from './sections/HowItWorks';
import TrustSection from './sections/TrustSection';
import WhyChooseSalesPal from './sections/WhyChooseSalesPal';

const Home = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main>
                <HeroSection />
                <WhySalesPal />
                <ModulesSection />
                <ModularApproach />
                <PricingSection />
                <HowItWorks />
                <WhyChooseSalesPal />
                <TrustSection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
