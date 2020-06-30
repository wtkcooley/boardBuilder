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
import './WheelsPage.css';
import {addCircleOutline, image} from "ionicons/icons";
import {Wheels} from "../../../metadata/itemInfo";

import {Plugins} from "@capacitor/core";
import eventSubscription from "../../../services/eventSubscription";

const node = require('../../../metadata/items.json');

interface Props {
    history: any
}

interface State {

}

class WheelsPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleCardClick.bind(this);
    }

    async handleCardClick(e: any, wheels: Wheels) {
        e.preventDefault();
        await Plugins.Storage.get({
            key: "currentBuild",
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then(build => {
            if (build != null) {
                let temp = build;
                temp.wheels = wheels;
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
        let items = node[2].map((wheels: Wheels) => {
            const backgroundImage: CSSProperties = {
                backgroundImage: `url(${wheels.image})`
            }
            return (
                <IonItem className="component" routerDirection="back" onClick={e => this.handleCardClick(e, wheels)} button={true}>
                    <div className="img-container" style={backgroundImage}>
                    </div>
                    <div className="text-container">
                        <h6>
                            {wheels.name}
                        </h6>
                        <p>
                            {wheels.brand}
                        </p>
                        <p>
                            {wheels.info}
                        </p>
                    </div>
                </IonItem>
            )
        })
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="toolbar-container">
                            <IonTitle className="md title-default hydrated">Wheels</IonTitle>
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

export default WheelsPage;
