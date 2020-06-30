import React, {useEffect} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Page imports */
import Home from './pages/Home/Home';
import BoardBuilder from './pages/BoardBuilder/BoardBuilder'
import DecksPage from './pages/Components/Decks/DecksPage'
import TrucksPage from './pages/Components/Trucks/TrucksPage'
import WheelsPage from "./pages/Components/Wheels/WheelsPage";
import BearingsPage from "./pages/Components/Bearings/BearingsPage";
import HardwarePage from "./pages/Components/Hardware/HardwarePage";
import ExtrasPage from "./pages/Components/Extras/ExtrasPage";


const App: React.FC = () => (
    <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home" component={Home} exact={true} />
        <Route path="/boardbuilder" component={BoardBuilder} exact={true} />
        <Route path="/decks" component={DecksPage} exact={true}/>
        <Route path="/trucks" component={TrucksPage} exact={true}/>
        <Route path="/wheels" component={WheelsPage} exact={true}/>
        <Route path="/bearings" component={BearingsPage} exact={true}/>
        <Route path="/hardware" component={HardwarePage} exact={true}/>
        <Route path="/extras" component={ExtrasPage} exact={true}/>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
