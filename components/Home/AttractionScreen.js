import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import SkeletonLoading from "../SkeletonLoading";
import ImageCarousel from '../ImageCarousel';


const { width: screenWidth } = Dimensions.get('window');


const AttractionScreen = ({ route, navigation }) => {
    const { attraction } = route.params;
    const attractions = useSelector((state) => state.attractions);
    const progress = useSharedValue(0);
    const [loadedImages, setLoadedImages] = useState({});


    const handleImageLoad = (imageUri) => {
        setLoadedImages((prevState) => ({
            ...prevState,
            [imageUri]: true,
        }));
    };


    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            <ImageCarousel
                images={attraction.images}
                height={300}
            />
            <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                <Text variant="titleLarge">{attraction.name}</Text>
                <Text variant="bodyMedium">{attraction.description}</Text>
                <Text variant="bodyMedium">{attraction.history}</Text>
            </View>
        </ScrollView>
    );
};

export default AttractionScreen;