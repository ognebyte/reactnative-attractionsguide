import { IconButton, useTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import CityScreen from './CityScreen';
import AttractionScreen from './AttractionScreen';
import CitySelectScreen from '../CitySelectScreen';


const Stack = createStackNavigator();


const Home = () => {
    const customTheme = useTheme();
    const navigation = useNavigation();

    const stackScreens = [
        { name: 'SelectCity', title: 'Выбор города', component: CitySelectScreen },
        { name: 'City', component: CityScreen },
        { name: 'Attraction', component: AttractionScreen },
    ];

    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                animation: 'slide_from_right',
                cardStyle: { backgroundColor: customTheme.colors.background },
                headerTitleStyle: { color: customTheme.colors.primary }
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            {stackScreens.map(screen =>
                <Stack.Screen name={screen.name} component={screen.component} key={screen.name}
                    options={{
                        headerStyle: { backgroundColor: customTheme.colors.elevation.level5 },
                        headerLeft: () => <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />,
                        headerTitle: screen.title? screen.title : null,
                        // headerTitleStyle: { display: 'none' }
                    }}
                />
            )}
        </Stack.Navigator>
    )
};

export default Home;