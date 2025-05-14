import { useState } from "react";
import { useSelector } from "react-redux";
import { View, ScrollView, Image, Dimensions } from "react-native";
import { Button, Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkeletonLoading from "../SkeletonLoading";
import CurrentCity from "./CurrentCity.js";
import AttractionItems from "./AttractionItems";


const HomeScreen = ({ navigation }) => {
    const currentCity = useSelector((state) => state.city);
    const cities = useSelector((state) => state.cities);
    const attractions = useSelector((state) => state.attractions);
    const categories = useSelector((state) => state.categories);
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (uri) => {
        setLoadedImages((prev) => {
            if (prev[uri]) return prev;
            return { ...prev, [uri]: true };
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ alignItems: 'flex-start', margin: 8 }}>
                <Button icon="map-marker" mode="contained-tonal"
                    onPress={() => navigation.navigate('SelectCity')}
                    style={{ width: 'auto' }}
                >
                    {!currentCity ? <SkeletonLoading width={120} height={16} /> : currentCity.name}
                </Button>
            </View>
            <ScrollView contentContainerStyle={{ gap: 8 }}>
                <CurrentCity navigate={() => navigation.navigate('SelectCity')} />

                <View style={{ gap: 8 }}>
                    <Text variant="headlineMedium" style={{ paddingHorizontal: 8 }}>Достопримечательности</Text>
                    <AttractionItems navigation={navigation} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen