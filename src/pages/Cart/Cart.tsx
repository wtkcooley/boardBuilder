import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonList, IonItem, IonButtons, IonReorder, IonLoading
} from '@ionic/react';
import {add, createOutline, trashOutline} from 'ionicons/icons'
import React, {CSSProperties} from 'react';

//style
import '../Items/items.css';
import './Cart.css'

//plugins
import {Plugins} from "@capacitor/core";

//interfaces
import {buildsObject, build, Build} from "../../metadata/itemInfo";
import eventSubscription from "../../services/eventSubscription";

interface Props {
    history: any
}

interface State {
    items: any,
    isLoading: boolean
    isEditing: boolean
}

class Cart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            items: [],
            isLoading: true,
            isEditing: false
        };

        this.updateCart = this.updateCart.bind(this);

        eventSubscription.get().onSubEvent("updateCart", () => {
            this.setState({
                isLoading: true
            })

            this.updateCart();
        });
        this.updateCart();
    }

    async handleBuyOnAmazon(e: any) {
        e.preventDefault()
        const baseUrl = "https://www.amazon.com/gp/aws/cart/add.html?AssociateTag=boardbuilder-20";

        const cartUrl = await Plugins.Storage.get({key: "cart"}).then(resp => resp.value).then(value => {
            if (value !== null)
                return JSON.parse(value)
            return new Error("No items in cart")
        }).then(cart => cart.cart).then(items => {
            let cartUrl = ""
            items.map((item: any, index: number) => {
                cartUrl = cartUrl + `&ASIN.${index}=${item.asin}&Quantity.${index}=1`
            })
            return cartUrl
        }).catch(err => console.error(err))

        const url = baseUrl + cartUrl
        await Plugins.Browser.open({url: url});
    }

    async updateCart() {
        console.log('here');
        const itemElements = await Plugins.Storage.get({
            key: "cart"
        }).then(resp => resp.value).then(json => {
            if (json != null)
                return JSON.parse(json)
            return new Error("No items in cart")
        }).then(cart => cart.cart).then(items => {
            console.log(items);
            const cartArray = items.map((item: any) => {
                const backgroundImage: CSSProperties = {
                    backgroundImage: `url(${item.image})`
                }
                return (
                    <IonItem className="component" button={true}>
                        <div className="img-container" style={backgroundImage}/>
                        <div className="text-container">
                            <div className="title-container">
                                <h6>
                                    {item.name}
                                </h6>
                            </div>
                            <div className="details-container">
                                <p>
                                    {item.brand}
                                </p>
                                <p>
                                    ${item.price}
                                </p>
                            </div>
                        </div>
                        <IonButton slot="end" onClick={(e) => this.deleteItem(e, item.id)}>
                            <IonIcon icon={trashOutline}/>
                        </IonButton>
                    </IonItem>
                )
            })
            console.log(cartArray)
            return cartArray;
        }).catch(err => console.error(err))

        console.log(itemElements)

        this.setState({
            items: itemElements,
            isLoading: false
        })
    }

    async deleteItem(e: any, id: number) {
        e.preventDefault()
        Plugins.Storage.get({
            key: "cart"
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then((cart: any) => {
            if (cart != null) {
                let temp = cart;
                temp.cart = temp.cart.filter((item: any) => {
                    return item.id !== id
                });
                return temp;
            }
        }).then(async newCart => {
            await Plugins.Storage.set({
                key: "cart",
                value: JSON.stringify(newCart)
            })
        }).then(() => this.updateCart())
    }

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Your Cart</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle>Your Cart</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonLoading
                        isOpen={this.state.isLoading}
                        message={'Loading Items...'}
                    />
                    <IonList>
                        {this.state.items}
                    </IonList>
                    <IonButton onClick={(e: any) => this.handleBuyOnAmazon(e)}>
                        Buy now on Amazon
                    </IonButton>
                </IonContent>
            </IonPage>
        );
    }
}

export default Cart;
