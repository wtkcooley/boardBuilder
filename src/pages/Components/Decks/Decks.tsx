import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonInput, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/react';
import React from 'react';
import './Decks.css';
import {addCircleOutline} from "ionicons/icons";

interface Props {

}

interface State {

}

class Decks extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const components = ["Deck 1", "Deck 2", "Deck 3"]
        const items: JSX.Element[] = []
        for (let i = 0; i < components.length; i++)
            items[i] =
                (<IonItem routerLink={`/${components[i]}`} key={i.toString()}>
                    <IonLabel>
                        {components[i]}
                    </IonLabel>
                    <IonIcon slot="end" icon={addCircleOutline}/>
                </IonItem>)
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="toolbar-container">
                            <IonInput placeholder="New Board" className="md title-default hydrated"/>
                            <IonButton routerLink="/home">Back</IonButton>
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