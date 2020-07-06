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
    IonCardContent
} from '@ionic/react';
import React, {CSSProperties} from 'react';
import './BearingsPage.css';
import {addCircleOutline, image} from "ionicons/icons";
import {Bearings} from "../../../metadata/itemInfo";

import {Plugins} from "@capacitor/core";
import eventSubscription from "../../../services/eventSubscription";

const node = require('../../../metadata/items.json');

interface Props {
    history: any
}

interface State {

}

class BearingsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleCardClick.bind(this);
    }

    async handleCardClick(e: any, bearings: Bearings) {
        e.preventDefault();
        await Plugins.Storage.get({
            key: "currentBuild",
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then(build => {
            if (build != null) {
                let temp = build;
                temp.bearings = bearings;
                return temp;
            }
        }).then(newBuild => {
            Plugins.Storage.set({
                key: "currentBuild",
                value: JSON.stringify(newBuild)
            })
        }).then(() => {
            eventSubscription.get().emitEvent("updateBoardBuilder");
            this.props.history.push('/boardbuilder');
        })
    }

    render() {
        const bearings = node.filter((item: any) => {
            return item.category === "bearings"
        })
        const items = bearings.map((bearings: Bearings) => {
            const backgroundImage: CSSProperties = {
                backgroundImage: `url(${bearings.image})`
            }
            return (
                <IonItem className="component" routerDirection="back" onClick={e => this.handleCardClick(e, bearings)} button={true}>
                    <div className="img-container" style={backgroundImage}>
                    </div>
                    <div className="text-container">
                        <h6>
                            {bearings.name}
                        </h6>
                        <p>
                            {bearings.brand}
                        </p>
                        <p>
                            {bearings.info}
                        </p>
                    </div>
                </IonItem>
            )
        })
        console.log(items)
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="toolbar-container">
                            <IonTitle className="md title-default hydrated">Bearings</IonTitle>
                            <IonButton routerDirection="back" routerLink="/boardbuilder">Back</IonButton>
                        </div>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        {items}
                    </IonList>
                </IonContent>
            </IonPage>
        );
    }
}

export default BearingsPage;
