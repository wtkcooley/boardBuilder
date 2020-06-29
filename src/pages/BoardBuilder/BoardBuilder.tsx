import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonInput, IonList, IonItem, IonLabel, IonIcon, IonAlert
} from '@ionic/react';
import React, {FormEvent} from 'react';
import './BoardBuilder.css';
import {addCircleOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";

import {Bearings, Build, build, buildsObject, Deck, Extras, Hardware, Trucks, Wheels} from "../../metadata/itemInfo";
import eventSubscription from "../../services/eventSubscription";

interface Props {
    history: any
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
    conflictingName: boolean
    showNameAlert: boolean
}

class BoardBuilder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            name: "New Board",
            isLoading: true,
            conflictingName: true,
            showNameAlert: false,
            deck: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                length: null,
                'grip-tape': null,
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
                price: null,
                link: null
            },
            hardware: {
                id: null,
                name: null,
                brand: null,
                image: null,
                length: null,
                info: null,
                price: null,
                link: null
            },
            extras: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price: null,
                link: null
            }
        }

        this.handleNameChange.bind(this);

        eventSubscription.get().onSubEvent("updateBoardBuilder", () => {
            this.setState({
                isLoading: true
            })
            this.checkBuild()
        })
        this.checkBuild();
    }

    async checkBuild() {
        console.log("Updating components")
        let currentBuild = await Plugins.Storage.get({key: "currentBuild"})
            .then(resp => resp.value)
        if (currentBuild === "New Board") {
            this.setState({
                name: "New Board"
            });
            let build: any = new Build(this.state.name);
            await Plugins.Storage.set({
                key: "currentBuild", value: JSON.stringify(build)
            })
            this.setState({
                    name: build.getName(),
                    isLoading: true,
                    deck: build.getDeck(),
                    trucks: build.getTrucks(),
                    wheels: build.getWheels(),
                    bearings: build.getBearings(),
                    hardware: build.getHardware(),
                    extras: build.getExtras()
            })
        } else {
            if (currentBuild != null) {
                let build = JSON.parse(currentBuild);
                build = build._build;
                this.setState({
                    name: build.name,
                    isLoading: true,
                    deck: build.deck,
                    trucks: build.trucks,
                    wheels: build.wheels,
                    bearings: build.bearings,
                    hardware: build.hardware,
                    extras: build.extras
                })
            }
        }
        this.setState({
            isLoading: false
        })
    }

    async checkName() {
        await Plugins.Storage.get({key:"builds"}).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then(json => {
            const sameNames = json.builds.filter((build: build) => {
                return build.name === this.state.name
            })
            console.log(sameNames)
            if(sameNames.length === 0) {
                this.setState({
                    conflictingName: false
                })
            } else {
                this.setState({
                    conflictingName: true
                })
            }
        })
    }

    async handleNameChange(e: any) {
        e.preventDefault();
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
                return temp;
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

    async handleBackButton(e: any) {
        e.preventDefault();
        await this.checkName();
        if(!this.state.conflictingName) {
            Plugins.Storage.get({
                key: "builds"
            }).then(resp => resp.value)
                .then(value => {
                    if (value != null)
                        return JSON.parse(value)
                }).then(async (buildsObject: buildsObject) => {
                if (buildsObject != null) {
                    let temp = buildsObject;
                    const newBuild = await Plugins.Storage.get({
                        key: "currentBuild"
                    }).then(resp => {
                        if (resp.value != null)
                            return JSON.parse(resp.value)
                    }).then(json => json._build);
                    temp.builds.push(newBuild);
                    return temp;
                }
            }).then(async buildsObject => {
                await Plugins.Storage.set({
                    key: "builds",
                    value: JSON.stringify(buildsObject)
                })
            }).then(() => {
                eventSubscription.get().emitEvent("updateHome");
                this.props.history.push('/home');
            })
        } else {
            this.setState({
                showNameAlert: true
            })
        }
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
        if (this.state.isLoading) {
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
                                <IonInput placeholder={this.state.name} onIonChange={(e) => this.handleNameChange(e)}
                                          className="md title-default hydrated"/>
                                <IonButton routerDirection="back" onClick={(e) => this.handleBackButton(e)}
                                           routerLink="/home">Back</IonButton>
                            </div>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonAlert
                          isOpen={this.state.showNameAlert}
                          onDidDismiss={() => this.setState({
                              showNameAlert: false
                          })}
                          cssClass=''
                          header={'Error Saving'}
                          subHeader={'Conflicting Names'}
                          message={'It seems that you are attempting to save this build under a name that already exists on this device. To fix this simply change the name to a unique name, so you don\'t accidentally edit or delete the wrong builds'}
                          buttons={['OK']}
                        />
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