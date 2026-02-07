import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

const TopUpCard = ({ item, onBuy }) => {
    const [quantity, setQuantity] = useState(1);
    const Icon = item.icon;

    const handleBuy = () => {
        const basePrice = Number(item.price.replace(/,/g, ''));
        const totalPrice = basePrice * quantity;

        onBuy({
            ...item,
            name: `${item.title} (x${quantity})`,
            price: totalPrice
        });
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.price}</p>
                    {item.subtext && <p className="text-[10px] text-gray-400">{item.subtext}</p>}
                </div>
            </div>

            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">
                Adds <strong className="text-gray-700">{item.quantity}</strong> to your balance.
            </p>

            <div className="flex items-center gap-3 mt-auto">
                <div className="flex items-center border border-gray-200 rounded-lg p-1">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
                <button
                    onClick={handleBuy}
                    className="flex-1 bg-black text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 active:scale-95 duration-150 flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default TopUpCard;
