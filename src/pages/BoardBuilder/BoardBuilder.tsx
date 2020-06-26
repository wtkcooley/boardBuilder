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

import {Bearings, Build, build, Deck, Extras, Hardware, Trucks, Wheels} from "../../metadata/itemInfo";
import eventSubscription from "../../services/eventSubscription";

interface Props {

}

interface State {
    name: string
    deck: Deck
    trucks: Trucks
    wheels: Wheels
    bearings: Bearings
    hardware: Hardware
    extras: Extras
    isLoading: boolean
}

class BoardBuilder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            name: "New Board",
            isLoading: true,
            deck: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                length: null,
                'grip-tape':  null,
                info: null,
                price: null,
                link: null
            },
            trucks: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                info: null,
                price: null,
                link: null
            },
            wheels: {
                id: null,
                name: null,
                brand: null,
                image: null,
                diameter: null,
                durometer: null,
                info: null,
                price: null,
                link: null
            },
            bearings: {
                id: null,
                name: null,
                brand: null,
                image: null,
                abec: null,
                info: null,
                price:  null,
                link: null
            },
            hardware: {
                id: null,
                name: null,
                brand: null,
                image: null,
                length: null,
                info: null,
                price:  null,
                link: null
            },
            extras: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price:  null,
                link: null
            }
        }

        this.handleNameChange.bind(this);

        eventSubscription.get().onSubEvent("updateComponents", () => {
            this.setState({
                isLoading: true
            })
            this.checkBuild()
        })
        this.checkBuild();
    }

    async checkBuild () {
        console.log("Updating components")
        let currentBuild = await Plugins.Storage.get({key: "currentBuild"})
            .then(resp => resp.value)

        if (currentBuild === "New Board") {
            const build = new Build(this.state.name);
            await Plugins.Storage.set({
                key: "currentBuild", value: JSON.stringify(build)
            })
        } else {
            if (currentBuild != null){
                let temp = JSON.parse(currentBuild);
                temp = temp._build;
                this.setState({
                    deck: temp.deck,
                    trucks: temp.trucks,
                    wheels: temp.wheels,
                    bearings: temp.bearings,
                    hardware: temp.hardware,
                    extras: temp.extras
                })
            }
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
            let returnValue: string | null = null;
            switch (components[i].name) {
                case "Deck":
                    returnValue = this.state.deck.name
                    break;
                case "Trucks":
                    returnValue = this.state.trucks.name
                    break;
                case "Wheels":
                    returnValue = this.state.wheels.name
                    break;
                case "Bearings":
                    returnValue = this.state.bearings.name
                    break;
                case "Hardware":
                    returnValue = this.state.hardware.name
                    break;
                case "Extras":
                    returnValue = this.state.extras.name
                    break;
            }
            items[i] =
                (<IonItem routerLink={components[i].link} key={i.toString()}>
                    <IonLabel className="ion-text-wrap">
                        {components[i].name}: {returnValue ? returnValue : "Not selected"}
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