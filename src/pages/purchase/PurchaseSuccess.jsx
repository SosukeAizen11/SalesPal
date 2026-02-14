import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const PurchaseSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] bg-white flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Purchase Successful
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Your subscription is now active. You can start using your modules from the dashboard.
                </p>
                <Button
                    className="w-full justify-center"
                    onClick={() => navigate('/marketing')}
                >
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default PurchaseSuccess;

