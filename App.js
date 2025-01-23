import { SafeAreaView, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Main from './components/main'

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
        console.log('asd')
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
    return (
        <SafeAreaView style={{ flex: 1 }} >
            <StatusBar backgroundColor={'#00000050'} barStyle={'light-content'} translucent/>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PaperProvider>
                    <Main />
                </PaperProvider>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default App;