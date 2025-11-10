/* eslint-disable no-unused-vars */
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import { useCart } from "../../../context/cart";
import SaveForLater from "./SaveForLater";
import ScrollToTopOnRouteChange from "./../../../utils/ScrollToTopOnRouteChange";
import SeoData from "../../../SEO/SeoData";
import PriceCard from "./PriceCard";
import { useAuth } from "../../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
    const { auth } = useAuth();
    const [cartItems, setCartItems, , , saveLaterItems] = useCart();

    // ✅ Simulated "Place Order" without Stripe
    const placeOrderHandler = async () => {
        if (cartItems.length === 0) {
            toast.warning("Your cart is empty!");
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/user/place-order`,
                { products: cartItems },
                {
                    headers: {
                        Authorization: auth?.token,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Order placed successfully!");
                setCartItems([]); // clear cart
            } else {
                toast.error("Could not place order. Try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Something went wrong! Please try again later.");
        }
    };

    return (
        <>
            <ScrollToTopOnRouteChange />
            <SeoData title="Shopping Cart | Flipkart.com" />
            <main className="w-full pt-5">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto ">
                    <div className="flex-1">
                        <div className="flex flex-col shadow bg-white">
                            <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                                My Cart ({cartItems?.length})
                            </span>

                            {cartItems?.length === 0 ? (
                                <EmptyCart />
                            ) : (
                                cartItems?.map((item, i) => (
                                    <CartItem
                                        product={item}
                                        inCart={true}
                                        key={i}
                                    />
                                ))
                            )}

                            {/* Place order button */}
                            <div className="flex justify-between items-center sticky bottom-0 left-0 bg-white">
                                <button
                                    onClick={placeOrderHandler}
                                    disabled={cartItems.length < 1}
                                    className={`${
                                        cartItems.length < 1
                                            ? "hidden"
                                            : "bg-orange"
                                    } w-full sm:w-1/3 mx-2 sm:mx-6 my-4 py-4 font-medium text-white shadow hover:shadow-lg rounded-sm `}
                                >
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>

                        {/* Saved for later section */}
                        <div className="flex flex-col mt-5 shadow bg-white mb-8">
                            <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                                Saved For Later ({saveLaterItems?.length})
                            </span>
                            {saveLaterItems?.map((item, i) => (
                                <SaveForLater product={item} key={i} />
                            ))}
                        </div>
                    </div>

                    <PriceCard cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Cart;
