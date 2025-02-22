"use client"
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/app/lib/hooks";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {decreaseCartThunk, getCartThunk, increaseCartThunk, clearCartThunk} from "@/app/store/slices/cartSlice";
import {deleteProduct} from "@/app/lib/api/cart";
import {getProductsByIds} from "@/app/lib/api/products";


export default function CartPage() {
    let baseUrl = 'http://localhost:3001/images';
    const params = useParams();
    const dispatch = useAppDispatch();

    let clientId;
    let client = null;
    let tempClient;

    if (typeof window !== "undefined") {
        let tempClient = localStorage.getItem("temp-client");
    }

    useEffect(() => {
        client = window.localStorage.getItem('client');
        if (client) {
            clientId = JSON.parse(client).id;
        }
    }, []);
    console.log('tempClient header', tempClient);
    console.log('client header', client);

    // let clientId, tempClient;
    // const client = JSON.parse(localStorage.getItem("client"));
    // tempClient = localStorage.getItem("temp-client");
    // if (client) {
    //     clientId = client.id;
    // }

    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);


    // const [show, setShow] = useState(false);

    const cart = useAppSelector(state => state.cart.cart);
    console.log('cart', cart);


    const getIdsFromCart = () => {
        const idsList = [];
        if (cart.length > 0) {
            for (let i = 0; i < cart.length; i++) {
                idsList.push(cart[i].product_id);
            }
            return idsList;
        }
    }
    useEffect(() => {
        if (cart && cart.length > 0) {
            (async () => {
                let ids = getIdsFromCart();
                const productsList = await getProductsByIds(ids);
                console.log('productsList', productsList);
                setProducts(productsList?.data);

                if (productsList?.data?.Images) {
                    setImages(productsList?.data.Images);
                }
            })();
        }
    }, [cart]);
    // console.log('products', products);
    // console.log('images', images);

    let sum = 0;
    if (products && products.length > 0 && cart && cart.length > 0) {
        cart.forEach(cartItem => {
            const product = products.find(product => product.product_id === cartItem.product_id);

            if (product) {
                sum += cartItem.product_count * product.price;
            }
        });
    }


    const deleteProductFromCart = async (id, size) => {
        const result = await deleteProduct(id, size);
        if (tempClient) {
            await dispatch(getCartThunk(tempClient));
        }
        await dispatch(getCartThunk(clientId));
    }

    const increaseCount = async (productId, sizeId) => {
        await dispatch(increaseCartThunk({productId: productId, sizeId: sizeId}));
        if (tempClient) {
            await dispatch(getCartThunk(tempClient));
        }
        await dispatch(getCartThunk(clientId));
    }
    const decreaseCount = async (productId, sizeId) => {
        await dispatch(decreaseCartThunk({productId: productId, sizeId: sizeId}));
        if (tempClient) {
            await dispatch(getCartThunk(tempClient));
        }
        await dispatch(getCartThunk(clientId));
    }

    const clearProductsInCart = async () => {
        if (tempClient) {
            await dispatch(clearCartThunk(tempClient));
            await dispatch(getCartThunk(tempClient));
        }
        await dispatch(clearCartThunk(clientId));
        await dispatch(getCartThunk(clientId));

    }

    const checkIsAuthorized = async (sum) => {
        if (clientId) {
            const result = await getCartPreOrder({cart: cart, sum: sum});
            // console.log('PRE ORDER', result);

            if (result?.data?.status === 200) {
                navigate('/orderform', {state: {sum}});
            }
        }
        if (tempClient) {
            await dispatch(changeCanvas(true));
            console.log('hahah you are temp')
        }
    }

    let total = 0;
    let productsListInCart = [];
    if (cart && cart.length > 0 && products.length > 0) {
        productsListInCart = cart.map(item => {
            const product = products.find((product) => product.product_id === item.product_id);
            if (product) {
                total += item.product_count * product.price;
                return (
                        <div key={item.id} className='flex flex-row'>
                            <div>
                                <img className={'w-36 h-auto p-2'} src={`${baseUrl}/${product.Images[0].image_path}`}/>
                            </div>

                            <div className={'flex flex-col ml-5 text-base w-full bg-fuchsia-400'}>
                                <div className='flex justify-between'>
                                    <div>{product.product_name}</div>
                                    <div className='cursor-pointer font-bold'
                                         onClick={() => deleteProductFromCart(product.product_id, item.product_size)}
                                    >X
                                    </div>
                                </div>
                                <div>Цена: {product.price}</div>
                                <div>Размер: {item.product_size}</div>
                                <div>
                                    <div className="flex flex-row gap-2 justify-center font-bold text-xl">
                                        <div style={{cursor: 'pointer'}}
                                             onClick={() => {
                                                 decreaseCartThunk(product.product_id, item.product_size)
                                             }}>-
                                        </div>
                                        {item.product_count}
                                        <div style={{cursor: 'pointer'}} onClick={() => {
                                            increaseCartThunk(product.product_id, item.product_size);
                                        }}>+
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                )

            }
            return null;
        })
    }


    return (
        <>
            <div className='w-full mr-16'>
                <div className='card h-16 bg-red-400 mb-10 shadow'>Выберите способо доставки</div>

                <div className="card card-compact bg-blue-400 shadow">
                    <div className="card-body">
                        <div>{productsListInCart}</div>
                        <a href="/cart"
                           className="btn btn-primary btn-md px-0 mx-0"
                           onClick={e => handleButtonClick(e)}>Оформить заказ
                        </a>
                    </div>
                </div>
            </div>

            <div
                tabIndex={0}
                className="card w-80 bg-base-100 h-16 shadow-xl scroll-card rounded-sm">

                <div className='mb-16 flex items-center justify-start'>доставка</div>
                <div className="card">
                    <div
                        className='card h-10 bg-base-100 rounded-sm flex items-center justify-center font-bold p-2'>Всего
                        к оплате {total}Р
                    </div>
                </div>
                <div className="card h-10 rounded-sm">
                    <a href="/cart"
                       className="btn btn-primary btn-md mt-5"
                       onClick={e => handleButtonClick(e)}>Оформить заказ
                    </a>
                </div>
            </div>
            {/*</div>*/}


            {/*<div className='flex flex-row'>*/}
            {/*    <div>*/}
            {/*        {productsListInCart}*/}
            {/*    </div>*/}
            {/*    <div>second column</div>*/}
            {/*</div>*/}

            {/*<div className="overflow-x-auto">*/}

            {/*</div>*/}
            {/*<div className={'cart-container'}>*/}
            {/*    {*/}
            {/*        cart && cart.length > 0 ?*/}
            {/*            <div>*/}
            {/*                <div>*/}
            {/*                    <div style={{display: "flex", justifyContent: "space-between"}}>*/}
            {/*                        <div>Сумма покупок: {sum} руб.</div>*/}
            {/*                        <div style={{color: 'red', fontWeight: 'bold', cursor: 'pointer'}}*/}
            {/*                             onClick={clearProductsInCart}>X*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    /!*{show ? <ConfirmModal*!/*/}
            {/*                    /!*    show={show}*!/*/}
            {/*                    /!*    close={closeModal}*!/*/}
            {/*                    /!*    text={'Вы правда хотите очистить корзину покупок?'}*!/*/}
            {/*                    /!*    func={() => dispatch(clearCart())}*!/*/}
            {/*/> : null}*/}

            {/*                </div>*/}
            {/*                </div>*/}

            {/*                <button onClick={() => checkIsAuthorized(sum)}>Оформить заказ</button>*/}
            {/*            </div> :*/}
            {/*            <>*/}
            {/*                <div>Добавьте товары в корзину</div>*/}
            {/*                /!*<Nav><Nav.Item><Nav.Link onClick={redirectToHome}>За*!/*/}
            {/*                /!*    покупками</Nav.Link></Nav.Item></Nav>*!/*/}
            {/*            </>*/}
            {/*    }*/}
            {/*</div>*/}
        </>
    )

}