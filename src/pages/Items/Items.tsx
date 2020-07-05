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
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent
} from '@ionic/react';
import React, {CSSProperties} from 'react';
import './Items.css';

const node = require('../../metadata/items.json');
console.log(node)
console.log(node.length)
console.log(node[0])
console.log(node[0].length)

interface Props {
    history: any
}

interface State {
    isLoading: boolean,
    items: any[]
}

class Items extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: true,
            items: []
        }


        this.update = this.update.bind(this)

        this.update();
    }

    update() {
        let temp = this.state.items
        for(let i = 0; i < node.length; i++) {
            for(let j = 0; j < node[i].length; i++) {
                let item = node[i][j];
                let backgroundImage: CSSProperties = {
                    backgroundImage: `url(${item.image})`
                };
                let itemJSX = (<IonItem className="component" routerDirection="back" onClick={e => e} button={true}>
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
                     </IonItem>);
                temp.push(itemJSX);
            }
        }
        console.log(temp)
        this.setState({
            items: temp,
            isLoading: false
        })
    }

    render() {
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
                    <IonList>
                        {this.state.items}
                    </IonList>
                </IonContent>
            </IonPage>
        );
    }
}

export default Items;
