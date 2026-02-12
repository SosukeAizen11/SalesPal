import React from 'react';
import { Plus, Minus, ShoppingBag, Check, Trash2, ShoppingCart } from 'lucide-react';
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
                quantity: 1
            });
        }
    };

    return (
        <div className={`p-6 rounded-2xl border transition-all flex flex-col h-full ${isInCart ? 'bg-blue-50/50 border-blue-200 ring-4 ring-blue-500/5' : 'bg-gray-50/30 border-gray-100 hover:border-blue-200 hover:bg-white'
            } group`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isInCart ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-gray-100 text-gray-400 group-hover:text-blue-600 group-hover:border-blue-200'
                    }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-right">
                    <p className="text-lg font-black text-gray-900 tracking-tight">₹{item.price.toLocaleString()}</p>
                    {item.subtext && <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{item.subtext}</p>}
                </div>
            </div>

            <h4 className="font-bold text-gray-900 text-sm mb-1">{item.name}</h4>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-6">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                Add {item.quantity} Credits
            </div>

            <div className="flex items-center gap-3 mt-auto">
                {isInCart && (
                    <div className="flex items-center bg-white rounded-lg p-1 border border-blue-100 shadow-sm">
                        <button
                            onClick={() => updateQuantity(item.id, Number(quantity) - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-600 transition-all active:scale-90"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-gray-900">{quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, Number(quantity) + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-600 transition-all active:scale-90"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
                <button
                    onClick={handleBuy}
                    className={`flex-1 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 group/btn ${isInCart ? 'bg-blue-600 text-white hover:bg-red-500' : 'bg-gray-900 text-white hover:bg-black'
                        }`}
                >
                    {isInCart ? (
                        <>
                            <span className="group-hover:hidden flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Selected</span>
                            <span className="hidden group-hover:flex items-center gap-2 text-white"><Trash2 className="w-3.5 h-3.5" /> Remove</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add Credit
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TopUpCard;
