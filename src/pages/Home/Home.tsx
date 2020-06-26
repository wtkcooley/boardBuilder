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
    IonCardContent, IonReorderGroup, IonItem
} from '@ionic/react';
import {add} from 'ionicons/icons'
import React, {CSSProperties} from 'react';

//style
import './Home.css';

//plugins
import {Plugins} from "@capacitor/core";

//interfaces
import {buildsObject, build, Build} from "../../metadata/itemInfo";
import eventSubscription from "../../services/eventSubscription";

const node = require("../../metadata/items.json");



interface Props {
    history: any
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

        eventSubscription.get().onSubEvent("updateHome", () => {
            this.setState({
                isLoading: true
            })

            this.updateBoards();
        });

        this.updateBoards();
    }

    async updateBoards () {
        await Plugins.Storage.set({key: "currentBuild", value: ""});

        await Plugins.Storage.get({key: "builds"}).then(resp => {
            if (resp.value != null)
                return JSON.parse(resp.value);
            else
                throw new Error("No boards to load");
        }).then((resp: buildsObject) => {
            console.log(resp)
            return (resp.builds.map((build: any) => {
                const backgroundImage: CSSProperties = {
                    backgroundImage: `url(${build.deck.image})`
                }
                return (
                <IonItem className="component" routerDirection="forward" /*onClick={e => this.handleCardClick(e, deck)}*/ button={true}>
                    <div className="img-container" style={backgroundImage}>
                    </div>
                    <div className="text-container">
                        <h1>
                            {build.name}
                        </h1>
                    </div>
                </IonItem>);
            }))
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

    handleNewBoard() {
        Plugins.Storage.set({key: "currentBuild", value: "New Board"});
        eventSubscription.get().emitEvent('updateBoardBuilder');
        this.props.history.push('/boardbuilder')
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
                        <IonReorderGroup>
                            {this.state.boards}
                        </IonReorderGroup>
                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton onClick={() => this.handleNewBoard()}>
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
