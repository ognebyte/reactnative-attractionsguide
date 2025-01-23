import { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Home = () => {
    const insets = useSafeAreaInsets();

    const getData = async () => {
        const querySnapshot = await getDocs(collection(FIREBASE_DB, "attractions"));
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
        });
    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <ScrollView style={{ flex: 1, paddingTop: insets.top, height: 10000 }}>
            <View style={{ height: 10000 }}>
            <Text>Home</Text>
            </View>
        </ScrollView>
    )
};

export default Home;