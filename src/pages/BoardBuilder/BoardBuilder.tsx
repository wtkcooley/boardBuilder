import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonInput, IonList, IonItem, IonLabel, IonIcon
} from '@ionic/react';
import React, {FormEvent} from 'react';
import './BoardBuilder.css';
import {addCircleOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";

import {Build, build} from "../../metadata/itemInfo";

interface Props {

}

interface State {
    name: string
    isLoading: boolean
}

class BoardBuilder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            name: "New Board",
            isLoading: true
        }

        this.handleNameChange.bind(this);

        this.checkBuild();
    }

    async checkBuild () {
        const currentBuild = await Plugins.Storage.get({key: "currentBuild"}).then(resp => resp.value)
        if (currentBuild === "New Board") {
            const build = new Build(this.state.name);
            await Plugins.Storage.set({
                key: "currentBuild", value: JSON.stringify(build)
            }).then(() => {
                this.setState({
                    isLoading: false
                })
            })
        }
        this.setState({
            isLoading: false
        })
    }

    async handleNameChange(e: any) {
        e.preventDefault();;
        this.setState({
            name: e.target.value
        });
        await Plugins.Storage.get({
            key: "currentBuild",
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then(build => {
            if (build != null) {
                let temp = build;
                temp._build.name = e.target.value;
                return temp
            }
        }).then(newBuild => {
            Plugins.Storage.set({
                key: "currentBuild",
                value: JSON.stringify(newBuild)
            })
        })
        Plugins.Storage.get({
            key: "currentBuild"
        }).then(resp => resp.value)
        .then(build => console.log(build))
    }

    render() {
        const components = [{
            name: "Deck",
            link: "/decks"
        },
        {
            name: "Trucks",
            link: "/trucks"
        },
        {
            name: "Wheels",
            link: "/trucks"
        },
        {
            name: "Bearings",
            link: "/bearings"
        },
        {
            name: "Hardware",
            link: "/hardware"
        },
        {
            name: "Extras",
            link: "/extras"
        }]
        let items: any = []
        for (let i = 0; i < components.length; i++) {
            items[i] =
                (<IonItem routerLink={components[i].link} key={i.toString()}>
                    <IonLabel>
                        {components[i].name}
                    </IonLabel>
                    <IonIcon slot="end" icon={addCircleOutline}/>
                </IonItem>)
        }
        if(this.state.isLoading) {
            return (
                <div className={"loader-container"}>
                    <div className={"loader"}/>
                </div>);
        } else {
            return (
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <div className="toolbar-container">
                                <IonInput placeholder="New Board" onIonChange={(e) => this.handleNameChange(e)} className="md title-default hydrated"/>
                                <IonButton routerDirection="back" routerLink="/home">Back</IonButton>
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
}

export default BoardBuilder;