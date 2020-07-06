import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonTitle,
    IonLoading,
    IonModal,
    IonFab,
    IonFabButton,
    IonAlert
} from '@ionic/react';
import React, {CSSProperties} from 'react';
import './Items.css';
import { arrowBackOutline } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import eventSubscription from '../../services/eventSubscription';

const node = require('../../metadata/items.json');

interface Props {
    history: any
}

interface State {
    isLoading: boolean,
    showItemModal: boolean,
    currentItem: any,
    currentItemImage: any,
    showAddedToCartAlert: boolean
}

class Items extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            showItemModal: false,
            currentItem: {},
            currentItemImage: null,
            showAddedToCartAlert: false
        }
    }

    handleItemClick(e: any, item: any) {
        const image: CSSProperties = {
            backgroundImage: `url(${item.image})`
        }
        this.setState({
            currentItem: item,
            currentItemImage: image,
            showItemModal: true
        })
    }

    async handleAddToCart(e: any, item: any) {
        e.preventDefault();
        this.setState({
            isLoading: true
        })
        let currentCart = await Plugins.Storage.get({
            key: "cart"
        }).then(resp => resp.value).then(value => {
            if(value !== null)
                return JSON.parse(value)
        })

        if (currentCart === undefined) {
            currentCart = {
                cart: []
            }
        }

        currentCart.cart.push(item)

        await Plugins.Storage.set({
            key: "cart",
            value: JSON.stringify(currentCart)
        })

        eventSubscription.get().emitEvent("updateCart");

        this.setState({
            isLoading: false,
            showAddedToCartAlert: true
        })
    }

    render() {
        let itemsArray = node.map((item: any) => {
            const backgroundImage: CSSProperties = {
                backgroundImage: `url(${item.image})`
            }
            return (
                <IonItem className="component" routerDirection="back" onClick={e => this.handleItemClick(e, item)} button={true}>
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
                </IonItem>
            )
        })
        const item = this.state.currentItem;
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="toolbar-container">
                            <IonTitle className="md title-default hydrated">Items</IonTitle>
                        </div>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                <IonModal isOpen={this.state.showItemModal}>
                    <IonFab vertical="top" horizontal="start" slot="fixed">
                        <IonFabButton onClick={() => this.setState({showItemModal: false})}>
                            <IonIcon icon={arrowBackOutline} />
                        </IonFabButton>
                    </IonFab>
                    <div className="item-modal-text-container">
                        <div className="item-modal-img-container" style={this.state.currentItemImage}/>
                        <h1>{item.name}</h1>
                        <p className="brand">
                            {item.brand}
                        </p>
                        {item.width ? <p>Width: {item.width}{(item.category === "deck") ? "\"": "mm"}</p> : <></>}
                        {item.length ? <p>Length: {item.length}"</p> : <></>}
                        {item.diameter ? <p>Diameter: {item.diameter}mm</p> : <></>}
                        {item.durometer ? <p>Durometer: {item.durometer}</p> : <></>}
                        <h2>
                            Price: ${item.price}
                        </h2>
                    </div>
                    <IonAlert
                        isOpen={this.state.showAddedToCartAlert}
                        onDidDismiss={() => this.setState({
                            showAddedToCartAlert: false
                        })}
                        header={'Added to Cart!'}
                        subHeader={'Your build was successfully added to your cart!'}
                        buttons={['OK']}
                    />
                    <IonButton onClick={(e) => this.handleAddToCart(e, item)}>Add to Cart</IonButton>
                    <IonLoading
                        isOpen={this.state.isLoading}
                        onDidDismiss={() => {
                            this.setState({
                                isLoading: false
                            })
                        }}
                        message={'Please wait...'}
                    />
                </IonModal>
                <IonLoading
                    isOpen={this.state.isLoading}
                    onDidDismiss={() => {
                        this.setState({
                            isLoading: false
                        })
                    }}
                    message={'Please wait...'}
                />
                    <IonList>
                        {itemsArray}
                    </IonList>
                </IonContent>
            </IonPage>
        );
    }
}

export default Items;
