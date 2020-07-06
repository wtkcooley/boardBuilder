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
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonModal,
    IonLoading,
    IonAlert,
    IonFab,
    IonFabButton
} from '@ionic/react';
import React, {CSSProperties} from 'react';
import '../../Items/items.css';
import {addCircleOutline, image, arrowBackOutline} from "ionicons/icons";
import {Hardware} from "../../../metadata/itemInfo";

import {Plugins} from "@capacitor/core";
import eventSubscription from "../../../services/eventSubscription";

const node = require('../../../metadata/items.json');

interface Props {
    history: any
}

interface State {
    showItemModal: boolean,
    currentItem: any,
    currentItemImage: any
}

class HardwarePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showItemModal: false,
            currentItem: {},
            currentItemImage: {}
        }

        this.handleAddToBuild = this.handleAddToBuild.bind(this);
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

    async handleAddToBuild(e: any, hardware: Hardware) {
        e.preventDefault();
        await Plugins.Storage.get({
            key: "currentBuild",
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then(build => {
            if (build != null) {
                let temp = build;
                temp.hardware = hardware;
                return temp;
            }
        }).then(newBuild => {
            Plugins.Storage.set({
                key: "currentBuild",
                value: JSON.stringify(newBuild)
            })
        }).then(() => {
            this.setState({
                showItemModal: false
            })
            eventSubscription.get().emitEvent("updateBoardBuilder");
            this.props.history.push('/boardbuilder');
        })
    }

    render() {
        const hardware = node.filter((item: any) => {
            return item.category === "hardware"
        })
        let items = hardware.map((hardware: Hardware) => {
            const backgroundImage: CSSProperties = {
                backgroundImage: `url(${hardware.image})`
            }
            return (
                <IonItem className="component" routerDirection="back" onClick={e => this.handleItemClick(e, hardware)} button={true}>
                    <div className="img-container" style={backgroundImage}/>
                    <div className="text-container">
                        <div className="title-container">
                            <h6>
                                {hardware.name}
                            </h6>
                        </div>
                        <div className="details-container">
                            <p>
                                {hardware.brand}
                            </p>
                            <p>
                                ${hardware.price}
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
                            <IonTitle className="md title-default hydrated">Hardware</IonTitle>
                            <IonButton routerDirection="back" routerLink="/boardbuilder">Back</IonButton>
                        </div>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        {items}
                    </IonList>
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
                            <p>Length: {item.length}"</p>
                            <h2>
                                Price: ${item.price}
                            </h2>
                        </div>
                        <IonButton onClick={(e) => this.handleAddToBuild(e, item)}>Add to build</IonButton>
                    </IonModal>
                </IonContent>
            </IonPage>
        );
    }
}

export default HardwarePage;
