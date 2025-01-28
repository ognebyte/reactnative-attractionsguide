import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import CityScreen from './CityScreen';
import AttractionScreen from './AttractionScreen';

const Stack = createStackNavigator();


const Home = () => {
    const customTheme = useTheme();
    const navigation = useNavigation();

    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown: false,
                    cardStyle: { backgroundColor: customTheme.colors.background }
                }}
            />
            <Stack.Screen name="City" component={CityScreen}
                options={{
                    cardStyle: { backgroundColor: customTheme.colors.background },
                    headerStyle: { backgroundColor: customTheme.colors.elevation.level5 },
                    headerLeft: () => <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />,
                    headerTitleStyle: {display: 'none'}
                }}
            />
            <Stack.Screen name="Attraction" component={AttractionScreen}
                options={{
                    cardStyle: { backgroundColor: customTheme.colors.background },
                    headerStyle: { backgroundColor: customTheme.colors.elevation.level5 },
                    headerLeft: () => <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />,
                    headerTitleStyle: {display: 'none'}
                }}
            />
        </Stack.Navigator>
    )
};

export default Home;