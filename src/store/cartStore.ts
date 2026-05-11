import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type CartItem = {
    uuid: string;
    quantity: number;
};


type RestaurantCart = {
    restaurantUuid: string;
    restaurantTitle: string;
    items: CartItem[];
};

type CartState = {
    cartsByRestaurant: Record<string, RestaurantCart>;
};

interface CartActions {
    addItem: (uuid: string, restaurantUuid: string ) => void;
    removeItem: (mealUuid: string, restaurantUuid: string) => void;
    clearCart: (restaurantUuid: string) => void;
};

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>((set) => ({
    // --- State ---
    cartsByRestaurant: {},

    // --- Actions ---
    addItem: (uuid, restaurantUuid) => {
        set((state) => {
            const existingOrder = state.cartsByRestaurant[restaurantUuid] || {
                restaurantUuid,
                items: [],
            };
            const existingItem = existingOrder.items.findIndex((item) => item.uuid === uuid);
            const updatedItems = [...existingOrder.items];
            if (existingItem > -1) {
                updatedItems[existingItem] = { uuid, quantity: updatedItems[existingItem].quantity + 1 };
            } else {
                updatedItems.push({ uuid, quantity: 1 });
            }

            return {
                cartsByRestaurant: {
                    ...state.cartsByRestaurant,
                    [restaurantUuid]: {
                        ...existingOrder,
                        items: updatedItems,
                    },
                },
            };
        });
    },


    removeItem: (uuid, restaurantUuid) => {
        set((state) => {
            const existingCart = state?.cartsByRestaurant?.[restaurantUuid];
            if (!existingCart) return state;
            
            const existingItemIndex = existingCart.items.findIndex(item => item.uuid === uuid);
            if (existingItemIndex < 0) return state;
            
            const existingItem = existingCart.items[existingItemIndex];
            const updatedQuantity = existingItem.quantity - 1;
            
            const updatedItems = [...existingCart.items];
            if (updatedQuantity > 0) {
                updatedItems[existingItemIndex] = { ...existingItem, quantity: updatedQuantity };
            } else {
                updatedItems.splice(existingItemIndex, 1);
            };
            if (!updatedItems.length) {
                const nextCarts = { ...state.cartsByRestaurant };
                delete nextCarts[restaurantUuid];
                return {
                    cartsByRestaurant: nextCarts,
                };
            }

            return {
                cartsByRestaurant: {
                    ...state.cartsByRestaurant,
                    [restaurantUuid]: {
                        ...existingCart,
                        items: updatedItems,
                    },
                }
            };
        });
    },

    clearCart: (restaurantUuid) => {
        set((state) => {
            const { [restaurantUuid]: _, ...restCarts } = state.cartsByRestaurant;
            return {
                cartsByRestaurant: restCarts,
            };
        });
    },
}));

export const useCart = () => useCartStore(s => s.cartsByRestaurant)
export const useCartActions = () => useCartStore(
    useShallow((s) => ({
        addItem: s.addItem,
        removeItem: s.removeItem,
        clearCart: s.clearCart,
    })));

