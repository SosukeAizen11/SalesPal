import React from 'react';

import HeroSection from './sections/HeroSection';
import WhySalesPal from './sections/WhySalesPal';
import ValueProposition from './sections/ValueProposition';
import ModulesSection from './sections/ModulesSection';
import HowItWorks from './sections/HowItWorks';
import PricingSection from './sections/PricingSection';
import FinalCTA from './sections/FinalCTA';


const Home = () => {
    return (
        <div className="bg-primary">
            <HeroSection />
            <WhySalesPal />
            <ValueProposition />
            <ModulesSection />
            <HowItWorks />
            <PricingSection />
            <FinalCTA />
        </div>
    );
};

export default Home;
