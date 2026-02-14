import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import HeroSection from './sections/HeroSection';
import WhySalesPal from './sections/WhySalesPal';
import ValueProposition from './sections/ValueProposition';
import ModulesSection from './sections/ModulesSection';
import HowItWorks from './sections/HowItWorks';
import PricingSection from './sections/PricingSection';
import FinalCTA from './sections/FinalCTA';


const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#pricing') {
            const el = document.getElementById('pricing');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

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
