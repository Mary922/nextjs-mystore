import {configureStore} from "@reduxjs/toolkit";
import {cartSlice} from "@/app/store/slices/cartSlice";
import {appCommonSlice} from "@/app/store/slices/appCommonSlice";
import {wishlistSlice} from "@/app/store/slices/wishlistSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartSlice.reducer,
            common: appCommonSlice.reducer,
            wishlist: wishlistSlice.reducer,
        }
    })
}