import { StatusBar, useColorScheme } from 'react-native';
import { Provider } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, Portal, MD3DarkTheme, MD3LightTheme, } from 'react-native-paper';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import store from "./features/store/store";
import Main from './components/main'
import customTheme from "./customTheme.json"

/*
    for build apk:
    eas build -p android --profile preview
*/


const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    // isAuth()
    if (user) {
        const uid = user.uid;
        console.log(uid)
    } else {
        // console.log('asd')
    }
});

// async function isAuth(){
//     try {
//         const value = await AsyncStorage.getItem('TASKS');
//         console.log(await AsyncStorage.getAllKeys())
//         // await AsyncStorage.setItem(
//         //     '@MySuperStore:key',
//         //     'I like to save it.',
//         // );
//         if (value !== null) {
//             // We have data!!
//             console.log(value);
//         } else console.log('first')
//     } catch (error) {
//         // Error retrieving data
//     }
// };

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
                    <Portal>
                        <BottomSheetModalProvider>
                            <NavigationContainer>
                                <Main />
                            </NavigationContainer>
                        </BottomSheetModalProvider>
                    </Portal>
                </PaperProvider>
            </GestureHandlerRootView>
        </Provider>
    );
};

export default App;