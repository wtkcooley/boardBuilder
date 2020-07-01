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
    IonCardContent, IonReorderGroup, IonItem, IonButtons, IonReorder
} from '@ionic/react';
import {add, createOutline, trashOutline} from 'ionicons/icons'
import React, {CSSProperties} from 'react';

//style
import './Home.css';

//plugins
import {Plugins} from "@capacitor/core";

//interfaces
import {buildsObject, build, Build} from "../../metadata/itemInfo";
import eventSubscription from "../../services/eventSubscription";

interface Props {
    history: any
}

interface State {
    boards: any,
    isLoading: boolean
    isEditing: boolean
}

class Home extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            boards: [],
            isLoading: true,
            isEditing: false
        };

        eventSubscription.get().onSubEvent("updateHome", () => {
            this.setState({
                isLoading: true
            })

            this.updateBoards();
        });

        this.updateBoards();
    }

    async updateBoards() {
        await Plugins.Storage.set({key: "currentBuild", value: ""});

        await Plugins.Storage.get({key: "builds"}).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value);
            else
                throw new Error("No boards to load");
        }).then((resp: buildsObject) => {
            return resp.builds.map((build: any) => {
                const backgroundImage: CSSProperties = {
                    backgroundImage: `url(${build.deck.image})`
                }
                return (
                    <IonItem className="component"
                             routerDirection="forward" onClick={e => {
                                 if (!this.state.isEditing)
                                     this.handleEditBoard(e, build)
                             }}
                             button={true}>
                        <div className="img-container" style={backgroundImage}/>
                        <div className="text-container">
                            <h1>
                                {build.name}
                            </h1>
                        </div>
                        <IonButton slot="end" onClick={(e) => this.deleteBoard(e, build.id)}
                                   hidden={!this.state.isEditing}>
                            <IonIcon icon={trashOutline}/>
                        </IonButton>
                        <IonReorder slot="end"/>
                    </IonItem>);
            })
        }).then(resp => {
            this.setState({
                boards: resp,
                isLoading: false
            });
        }).catch(e => {
            const buildsObject: buildsObject = {
                builds: []
            }
            Plugins.Storage.set({
                key: "builds",
                value: JSON.stringify(buildsObject)
            })
            this.setState({
                isLoading: false
            });
            console.log(e);
        })
    }

    async handleEditBoard(e: any, build: any) {
        e.preventDefault();
        await Plugins.Storage.set({key: "currentBuild", value: JSON.stringify(build)});
        eventSubscription.get().emitEvent('updateBoardBuilder');
        this.props.history.push('/boardbuilder');
    }

    async handleNewBoard(e: any) {
        e.preventDefault();
        await Plugins.Storage.set({key: "currentBuild", value: "New Board"});
        eventSubscription.get().emitEvent('updateBoardBuilder');
        this.props.history.push('/boardbuilder');
    }

    async handleToggle(e: any) {
        e.preventDefault();
        this.setState({
            isEditing: !this.state.isEditing
        })
        await this.updateBoards()
    }

    async doReorder(event: any) {
        // The `from` and `to` properties contain the index of the item
        // when the drag started and ended, respectively
        console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

        // Finish the reorder and position the item in the DOM based on
        // where the gesture ended. This method can also be called directly
        // by the reorder group
        event.detail.complete();
    }

    async deleteBoard(e: any, id: number) {
        e.preventDefault()
        Plugins.Storage.get({
            key: "builds"
        }).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value)
        }).then((buildsObject: buildsObject) => {
            console.log(buildsObject)
            if (buildsObject != null) {
                let temp = buildsObject;
                temp.builds = temp.builds.filter(build => {
                    return build.id !== id
                });
                return temp;
            }
        }).then(async buildsObject => {
            await Plugins.Storage.set({
                key: "builds",
                value: JSON.stringify(buildsObject)
            })
        }).then(() => this.updateBoards())
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
                            <IonButtons slot="end">
                                <IonButton slot="icon-only" onClick={(e) => this.handleToggle(e)}>
                                    <IonIcon icon={createOutline}/>
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonHeader collapse="condense">
                            <IonToolbar>
                                <IonTitle>Board Builder</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton slot="icon-only" onClick={(e) => this.handleToggle(e)}>
                                        <IonIcon icon={createOutline}/>
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonReorderGroup disabled={!this.state.isEditing} onIonItemReorder={this.doReorder}>
                            {this.state.boards}
                        </IonReorderGroup>
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton onClick={(e) => this.handleNewBoard(e)}>
                                <IonIcon icon={add}/>
                            </IonFabButton>
                        </IonFab>
                    </IonContent>
                </IonPage>
            );
        }

    }
}

export default Home;
