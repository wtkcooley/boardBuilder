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
import React from 'react';
import './Decks.css';
import {addCircleOutline} from "ionicons/icons";
import {Deck} from "../../../metadata/itemInfo";

const node = require('../../../metadata/items.json');

interface Props {

}

interface State {

}

class Decks extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.handleCardClick.bind(this);
    }

    handleCardClick(e: any) {

    }

    render() {
        let items = node[0].map((deck: Deck) => {
                return (<IonCard onClick={e => this.handleCardClick(e)} routerLink="" button={true}>
                    <img src={deck.image ? deck.image : undefined} />
                    <IonCardHeader>
                      <IonCardSubtitle>{deck.brand}</IonCardSubtitle>
                      <IonCardTitle>{deck.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {deck.info}
                    </IonCardContent>
                  </IonCard>)})
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="toolbar-container">
                            <IonTitle className="md title-default hydrated">Decks</IonTitle>
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

export default Decks;
