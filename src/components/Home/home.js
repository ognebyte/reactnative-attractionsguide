import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import CitySelectScreen from '@/components/Layouts/CitySelectScreen';
import HomeScreen from './HomeScreen';
import CityScreen from './CityScreen';
import AttractionScreen from './AttractionScreen';
import ProfileScreen from './Profile/profile';
import { resetAttractionAnimateFlag } from '@features/store/attractionSlice';

const Stack = createStackNavigator();

const Home = ({ jumpTo }) => {
    const navigation = useNavigation();
    const customTheme = useTheme();
    const dispatch = useDispatch();
    const mapStore = useSelector((state) => state.map);
    const attractionStore = useSelector((state) => state.attraction);

    const stackScreens = [
        { name: 'HomeScreen', component: HomeScreen },
        { name: 'SelectCity', component: CitySelectScreen },
        { name: 'City', component: CityScreen },
        { name: 'HomeAttraction', component: AttractionScreen },
        { name: 'Profile', component: ProfileScreen },
    ];

    useEffect(() => {
        if (mapStore.shouldAnimate && jumpTo) {
            jumpTo('map');
        }
    }, [mapStore]);

    useEffect(() => {
        if (attractionStore.shouldAnimate && attractionStore.attraction) {
            dispatch(resetAttractionAnimateFlag());
            navigation.navigate('HomeAttraction', {
                attraction: attractionStore.attraction,
            });
        }
    }, [attractionStore]);

    return (
        <Stack.Navigator
            initialRouteName='HomeScreen'
            screenOptions={{
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: customTheme.colors.background },
                headerTitleStyle: { color: customTheme.colors.primary }
            }}
        >
            {stackScreens.map(screen =>
                <Stack.Screen
                    name={screen.name}
                    component={screen.component}
                    key={screen.name}
                    options={{
                        headerShown: false
                    }}
                />
            )}
        </Stack.Navigator>
    )
};

export default Home;