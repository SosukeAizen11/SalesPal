import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HeroSection from './sections/HeroSection';
import WhySalesPal from './sections/WhySalesPal';
import ValueProposition from './sections/ValueProposition';
import ModulesSection from './sections/ModulesSection';
import HowItWorks from './sections/HowItWorks';
import PricingSection from './sections/PricingSection';
import FinalCTA from './sections/FinalCTA';


const Home = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main>
                <HeroSection />
                <WhySalesPal />
                <ValueProposition />
                <ModulesSection />
                <HowItWorks />
                <PricingSection />
                <FinalCTA />

            </main>
            <Footer />
        </div>
    );
};

export default Home;
