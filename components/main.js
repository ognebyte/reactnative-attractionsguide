import { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import Map from './Map/map';
import Home from './Home/home';


const Main = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'map', title: 'Map', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        home: Home,
        map: Map
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            
            sceneAnimationEnabled={true}
            sceneAnimationType={'opacity'}
            shifting={true}
        />
    );
};

export default Main;