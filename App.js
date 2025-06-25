import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from "react-redux";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3DarkTheme, MD3LightTheme, } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import store from "./src/features/store/store";
import customTheme from "./src/customTheme.json"
import Main from './src/components/main'

import { enableScreens } from 'react-native-screens';
enableScreens();

/*
    for build apk:
    eas build -p android --profile preview
*/

const App = () => {
    const colorScheme = useColorScheme();

    const paperTheme = colorScheme === 'light'
        ? { ...MD3LightTheme, ...customTheme.light }
        : { ...MD3DarkTheme, ...customTheme.dark };

    return (
        <Provider store={store}>
            <StatusBar backgroundColor={'#00000050'} barStyle={'light-content'} translucent />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PaperProvider theme={paperTheme}>
                        <NavigationContainer>
                            <Main />
                        </NavigationContainer>
                </PaperProvider>
            </GestureHandlerRootView>
        </Provider>
    );
};

export default App;