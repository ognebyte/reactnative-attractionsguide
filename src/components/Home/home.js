import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import CitySelectScreen from '@/components/CitySelectScreen';
import CityScreen from './CityScreen';
import AttractionScreen from './AttractionScreen';


const Stack = createStackNavigator();


const Home = (props) => {
    const customTheme = useTheme();
    // @ts-ignore
    const map = useSelector((state) => state.map);

    const stackScreens = [
        { name: 'Home', component: HomeScreen },
        { name: 'Select City', component: CitySelectScreen },
        { name: 'City', component: CityScreen },
        { name: 'Attraction', component: AttractionScreen },
    ];

    useEffect(() => {
        if (map) {
            props.jumpTo('map')
        }
    }, [map])

    return (
        <
            // @ts-ignore
            Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: customTheme.colors.background },
                headerTitleStyle: { color: customTheme.colors.primary }
            }}
        >
            {stackScreens.map(screen =>
                <Stack.Screen name={screen.name} component={screen.component} key={screen.name}
                    options={{
                        headerShown: false
                    }}
                />
            )}
        </Stack.Navigator>
    )
};

export default Home;