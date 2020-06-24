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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent
} from '@ionic/react';
import {add} from 'ionicons/icons'
import React from 'react';

//style
import './Home.css';

//plugins
import {Plugins} from "@capacitor/core";

//interfaces
import {buildsObject, build} from "../../metadata/itemInfo";

const node = require("../../metadata/items.json");



interface Props {

}

interface State {
    boards: any,
    isLoading: boolean
}

class Home extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            boards: [],
            isLoading: true
        };

        Plugins.Storage.set({key: "currentBuild", value: ""});

        Plugins.Storage.get({key: "builds"}).then(resp => {
            if (typeof resp.value === 'string')
                return JSON.parse(resp.value);
            else
                throw new Error("No boards to load");
        }).then((resp: buildsObject) => {
            return (resp.builds.map((build: build) => {
                return (<IonCard>
                    <img src={build.deck.image ? build.deck.image : undefined} alt={build.name ? build.name : undefined}/>
                    <IonCardHeader>
                        <IonCardSubtitle/>
                        <IonCardTitle>{build.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                    </IonCardContent>
                </IonCard>);
            }))
        }).then(resp => {
            this.setState({
                boards: resp,
                isLoading: false
            });
        }).catch(e => {
            this.setState({
                isLoading:false
            });
            console.log(e);
        })
    }

    handleNewBoard() {
        Plugins.Storage.set({key: "currentBuild", value: "New Board"});
    }

    render() {
        if (this.state.isLoading) {
            return <></>;
        } else {
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
                            <IonFabButton onClick={() => this.handleNewBoard()} routerLink={"/boardbuilder"}>
                                <IonIcon icon={add}/>
                            </IonFabButton>
                        </IonFab>
                    </IonContent>
                </IonPage>
            );
        }

    }
};

export default Home;
