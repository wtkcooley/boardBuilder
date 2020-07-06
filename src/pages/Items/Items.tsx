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
    IonLoading
} from '@ionic/react';
import React, {CSSProperties} from 'react';
import './Items.css';

const node = require('../../metadata/items.json');

interface Props {
    history: any
}

interface State {
    isLoading: boolean,
}

class Items extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
        }
    }

    handleItemClick(e: any, item: any) {
        console.log("handling" + item)
    }

    render() {
        let itemsArray = node.map((item: any) => {
            const backgroundImage: CSSProperties = {
                backgroundImage: `url(${item.image})`
            }
            return (
                <IonItem className="component" routerDirection="back" onClick={e => this.handleItemClick(e, item)} button={true}>
                    <div className="img-container" style={backgroundImage}>
                    </div>
                    <div className="text-container">
                        <h6>
                            {item.name}
                        </h6>
                        <p>
                            {item.brand}
                        </p>
                        <p>
                            {item.info}
                        </p>
                    </div>
                </IonItem>
            )
        })
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="toolbar-container">
                            <IonTitle className="md title-default hydrated">Items</IonTitle>
                            <IonButton routerDirection="back" routerLink="/boardbuilder">Back</IonButton>
                        </div>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                <IonLoading
                    isOpen={this.state.isLoading}
                    onDidDismiss={() => {
                        this.setState({
                            isLoading: false
                        })
                    }}
                    message={'Please wait...'}
                />
                    <IonList>
                        {itemsArray}
                    </IonList>
                </IonContent>
            </IonPage>
        );
    }
}

export default Items;
