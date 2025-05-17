import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { View, Image, ScrollView } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import SkeletonLoading from "@/components/SkeletonLoading";
import ImageCarousel from '@/components/ImageCarousel';


const CityScreen = ({ route, navigation }) => {
    const { city } = route.params;
    // @ts-ignore
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
                images={city.images}
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
                                    // @ts-ignore
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