import React from 'react';
import { Plus, Minus, ShoppingBag, Check, Trash2 } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

const TopUpCard = ({ item, onBuy }) => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const cartItem = cartItems.find(i => i.id === item.id);
    const isInCart = !!cartItem;
    const quantity = cartItem ? cartItem.quantity : 1;
    const Icon = item.icon;

    const handleBuy = () => {
        if (isInCart) {
            removeFromCart(item.id);
        } else {
            onBuy({
                ...item,
                quantity: 1 // Default to 1 as per requirements
            });
        }
    };

    return (
        <div className={`p-6 rounded-3xl border transition-all flex flex-col h-full ring-1 ring-black/[0.02] ${isInCart ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5'
            } group`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${isInCart ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-500 group-hover:bg-amber-50 group-hover:text-amber-600'
                    }`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-gray-900">₹{item.price.toLocaleString()}</p>
                    {item.subtext && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.subtext}</p>}
                </div>
            </div>

            <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
            <p className="text-xs text-gray-500 mb-6 flex-1 italic">
                {isInCart ? (
                    <span className="text-blue-600 font-bold">✓ Selected for checkout</span>
                ) : (
                    <>Adds <strong className="text-gray-900">{item.quantity}</strong> to your balance.</>
                )}
            </p>

            <div className="flex items-center gap-3 mt-auto">
                {isInCart && (
                    <div className="flex items-center bg-white rounded-xl p-1 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                        <button
                            onClick={() => updateQuantity(item.id, Number(quantity) - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-all active:scale-90"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-gray-900">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, Number(quantity) + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-all active:scale-90"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <button
                    onClick={handleBuy}
                    className={`flex-1 text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group/btn ${isInCart
                            ? 'bg-blue-600 text-white hover:bg-red-500'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                >
                    {isInCart ? (
                        <>
                            <span className="group-hover:hidden flex items-center gap-2"><Check className="w-4 h-4" /> Added</span>
                            <span className="hidden group-hover:flex items-center gap-2"><Trash2 className="w-4 h-4" /> Remove</span>
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TopUpCard;
