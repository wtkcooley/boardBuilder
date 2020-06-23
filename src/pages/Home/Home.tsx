import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonFab} from '@ionic/react';
import {addCircleOutline} from 'ionicons/icons'
import React from 'react';
import './Home.css';


interface Props {

}

interface State {

}

class Home extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Board Builder</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">Board Builder</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonButton shape={"round"} className={"add-build-button"} routerLink={"/boardbuilder"}>
                            <IonIcon icon={addCircleOutline}></IonIcon>
                        </IonButton>
                    </IonFab>

                </IonContent>
            </IonPage>
        );
    }
};

export default Home;
