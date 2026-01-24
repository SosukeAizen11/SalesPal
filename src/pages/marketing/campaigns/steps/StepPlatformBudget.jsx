import React, { useState } from 'react';
import PlatformSelector from '../components/budget/PlatformSelector';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetBreakdown from '../components/budget/BudgetBreakdown';
import AIReasoningBox from '../components/budget/AIReasoningBox';

const StepPlatformBudget = () => {
    const [selectedPlatforms, setSelectedPlatforms] = useState(['meta', 'google']);
    const [dailyBudget, setDailyBudget] = useState(3500);

    return (
        <div className="animate-fade-in-up grid lg:grid-cols-2 gap-8">
            {/* Left Column: Platform Selection */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h3>
                    <PlatformSelector
                        selectedPlatforms={selectedPlatforms}
                        onToggle={setSelectedPlatforms}
                    />
                </div>
            </div>

            {/* Right Column: Budget Logic */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
                        <BudgetCard
                            dailyBudget={dailyBudget}
                            setDailyBudget={setDailyBudget}
                        />

                        <AIReasoningBox />

                        <div className="pt-4 border-t border-gray-200">
                            <BudgetBreakdown
                                platforms={selectedPlatforms}
                                dailyBudget={dailyBudget}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepPlatformBudget;
