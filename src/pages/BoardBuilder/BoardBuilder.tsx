import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonInput, IonList, IonItem, IonLabel, IonIcon, IonAlert, IonFabButton, IonFab, IonFabList
} from '@ionic/react';
import React, {FormEvent} from 'react';
import './BoardBuilder.css';
import {add, addCircleOutline, cartOutline, key, saveOutline} from "ionicons/icons";
import {Plugins} from "@capacitor/core";

import {Bearings, Build, build, buildsObject, Deck, Extras, Hardware, Trucks, Wheels} from "../../metadata/itemInfo";
import eventSubscription from "../../services/eventSubscription";

interface Props {
    history: any
}

interface State {
    name: string | null
    id: number | null
    deck: Deck
    trucks: Trucks
    wheels: Wheels
    bearings: Bearings
    hardware: Hardware
    extras: Extras
    isLoading: boolean
    conflictingName: boolean
    showNameAlert: boolean
    isEdited: boolean
    originalName: string | null
}

class BoardBuilder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            name: "New Board",
            id: null,
            isLoading: true,
            conflictingName: true,
            showNameAlert: false,
            isEdited: false,
            originalName: "New Board",
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
                link: null,
                asin: null
            },
            trucks: {
                id: null,
                name: null,
                brand: null,
                image: null,
                width: null,
                info: null,
                price: null,
                link: null,
                asin: null
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
                link: null,
                asin: null
            },
            bearings: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price: null,
                link: null,
                asin: null
            },
            hardware: {
                id: null,
                name: null,
                brand: null,
                image: null,
                length: null,
                info: null,
                price: null,
                link: null,
                asin: null
            },
            extras: {
                id: null,
                name: null,
                brand: null,
                image: null,
                info: null,
                price: null,
                link: null,
                asin: null
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
            const date = new Date()
            let build: Build = new Build(this.state.name, date.getTime());
            await Plugins.Storage.set({
                key: "currentBuild", value: JSON.stringify(build.getBuild())
            })
            this.setState({
                name: build.getName(),
                originalName: build.getName(),
                id: build.getId(),
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
                this.setState({
                    name: build.name,
                    originalName: build.name,
                    id: build.id,
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
        await Plugins.Storage.get({key: "builds"}).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then(json => {
            this.setState({
                conflictingName: false
            })
            console.log(json);
            json.builds.filter((build: build) => {
                if (build.name === this.state.name) {
                    console.log('here');
                    this.setState({
                        conflictingName: true,
                        showNameAlert: true
                    })
                }
            })
        })
    }

    async deletePreviousSave() {
        console.log("Deleting: " + this.state.id);
        const newBuilds = await Plugins.Storage.get({
            key: "builds"
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then((buildsObject: buildsObject) => {
            if (buildsObject != null) {
                let temp = buildsObject;
                temp.builds = temp.builds.filter(build => {
                    return build.id !== this.state.id
                });
                return temp;
            }
        })

        await Plugins.Storage.set({
            key: "builds",
            value: JSON.stringify(newBuilds)
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
                temp.name = e.target.value;
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

    async handleSave(e: any) {
        e.preventDefault();
        await this.deletePreviousSave();
        /*await this.checkName();
        let name = this.state.name
        if (this.state.conflictingName)
            name = this.state.originalName*/
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
                })
                /*newBuild.name = name;*/
                temp.builds.push(newBuild);
                return temp;
            }
        }).then(async buildsObject => {
            await Plugins.Storage.set({
                key: "builds",
                value: JSON.stringify(buildsObject)
            })
        })
    }

    async handleAddToCart(e: any) {
        e.preventDefault();
        let currentCart = await Plugins.Storage.get({
            key: "cart"
        }).then(resp => resp.value).then(value => {
            if(value !== null)
                return JSON.parse(value)
        })

        console.log("1" + currentCart);

        if (currentCart === undefined) {
            currentCart = {
                cart: []
            }
        }

        console.log("2" + currentCart);

        if (this.state.deck.id !== null)
            currentCart.cart.push(this.state.deck)
        if (this.state.trucks.id !== null)
            currentCart.cart.push(this.state.trucks)
        if (this.state.wheels.id !== null)
            currentCart.cart.push(this.state.wheels)
        if (this.state.bearings.id !== null)
            currentCart.cart.push(this.state.bearings)
        if (this.state.hardware.id !== null)
            currentCart.cart.push(this.state.hardware)
        if (this.state.extras.id !== null)
            currentCart.cart.push(this.state.extras)

        console.log("3" + currentCart);

        await Plugins.Storage.set({
            key: "cart",
            value: JSON.stringify(currentCart)
        })

        eventSubscription.get().emitEvent("updateCart");
    }

    async handleBackButton(e: any) {
        eventSubscription.get().emitEvent("updateHome");
        this.props.history.push('/home');
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
                link: "/wheels"
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
                                <IonInput placeholder={this.state.name ? this.state.name : "Error"}
                                          onIonChange={(e) => this.handleNameChange(e)}
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
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <div className="button-container">
                                <IonFabButton className="save-button" onClick={(e) => this.handleSave(e)}>
                                    <IonIcon icon={saveOutline}/>
                                </IonFabButton>
                                <IonFabButton className="cart-button" onClick={(e) => this.handleAddToCart(e)}>
                                    <IonIcon icon={cartOutline}/>
                                </IonFabButton>
                            </div>
                        </IonFab>
                    </IonContent>
                </IonPage>
            );
        }
    }
}

export default BoardBuilder;