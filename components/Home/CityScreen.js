import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import SkeletonLoading from "../SkeletonLoading";


const CityScreen = ({ route, navigation }) => {
    const customTheme = useThemee();
    const { city } = route.params;
    const attractions = useSelector((state) => state.attractions);
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
                images={currentCity.images}
                height={300}
            />
            <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                <Text variant="titleLarge">{city.name}</Text>
                <Text variant="bodyLarge">Основан: {city.founded}</Text>
                <Text variant="bodyLarge">Площадь: {city.area}</Text>
                <Text variant="bodyLarge">Население: {city.population}</Text>
                <Text variant="bodyMedium">{city.description}</Text>
                <Text variant="bodyMedium">{city.history}</Text>
            </View>
            <Text variant="titleLarge" style={{ paddingHorizontal: 16, marginTop: 16 }}>Что посмотреть</Text>
            <ScrollView
                horizontal={true}
                contentContainerStyle={{ padding: 8, gap: 4 }}
                showsHorizontalScrollIndicator={false}
            >
                {attractions?.filter((attraction) => attraction.city_id === city.id).map((attraction) =>
                    <TouchableRipple key={attraction.id}
                        style={{ width: 200, borderRadius: 8, padding: 8, gap: 8 }}
                        onPress={() => navigation.navigate('Attraction', { attraction })}
                    >
                        <>
                            <View style={{ height: 120 }}>
                                {!loadedImages[attraction.images[0]] && <SkeletonLoading />}
                                <Image
                                    source={{ uri: attraction.images[0] }}
                                    width={'100%'} height={'100%'}
                                    onLoad={() => handleImageLoad(attraction.images[0])}
                                    style={{
                                        flex: 1, borderRadius: 8,
                                        display: !loadedImages[attraction.images[0]] ? 'none' : 'flex',
                                    }}
                                />
                            </View>
                            <Text variant="titleMedium" numberOfLines={2}>
                                {attraction.name}
                            </Text>
                        </>
                    </TouchableRipple>
                )}
            </ScrollView>
        </ScrollView>
    );
};

export default CityScreen;