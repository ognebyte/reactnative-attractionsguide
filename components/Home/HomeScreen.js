import { useState } from "react";
import { View, ScrollView, Image, Dimensions } from "react-native";
import { Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import SkeletonLoading from "../SkeletonLoading";


const HomeScreen = ({ navigation }) => {
    const cities = useSelector((state) => state.cities);
    const attractions = useSelector((state) => state.attractions);
    const categories = useSelector((state) => state.categories);
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (imageUri) => {
        setLoadedImages((prevState) => ({
            ...prevState,
            [imageUri]: true,
        }));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flex: 1, paddingVertical: 24, gap: 8 }}>
                <View>
                    <Text variant="headlineMedium" style={{ paddingHorizontal: 16 }}>Близко от вас</Text>
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={{ padding: 8, gap: 4 }}
                        showsHorizontalScrollIndicator={false}
                    >
                        {attractions?.map((attraction) =>
                            <TouchableRipple key={attraction.id}
                                style={{ width: 200, borderRadius: 8, padding: 8, gap: 8 }}
                                onPress={() => navigation.navigate('Attraction', { attraction })}
                            >
                                <>
                                    <View style={{ height: 120 }}>
                                        {!loadedImages[attraction.images[0]] && (
                                            <SkeletonLoading />
                                        )}
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
                </View>
                <Text variant="headlineMedium" style={{ paddingHorizontal: 16 }}>Города</Text>
                {cities?.length == 0 ?
                    Array.from({ length: 3 }).map((_, index) =>
                        <View key={"skeleton-" + index}
                            style={{
                                height: 140,
                                paddingHorizontal: 12, paddingVertical: 4
                            }}
                        >
                            <SkeletonLoading />
                        </View>
                    )
                    :
                    cities.map((city) =>
                        <TouchableRipple key={city.id}
                            onPress={() => navigation.navigate('City', { city })}
                            style={{
                                flexDirection: 'row',
                                width: '100%', minHeight: 140,
                                paddingHorizontal: 16, paddingVertical: 12,
                                gap: 8,
                            }}
                        >
                            <>
                                <View style={{ flex: 1, gap: 8 }}>
                                    <Text variant="titleLarge">
                                        {city.name}
                                    </Text>
                                    <View style={{ flex: 1, gap: 8, justifyContent: 'center' }}>
                                        <Text variant="bodyMedium">
                                            Основан: {city.founded}
                                        </Text>
                                        <Text variant="bodyMedium">
                                            Площадь: {city.area}
                                        </Text>
                                        <Text variant="bodyMedium">
                                            Население: {city.population}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: '45%' }}>
                                    {!loadedImages[city.images[0]] && (
                                        <SkeletonLoading />
                                    )}
                                    <Image
                                        source={{ uri: city.images[0] }}
                                        width={'100%'} height={'100%'}
                                        onLoad={() => handleImageLoad(city.images[0])}
                                        progressiveRenderingEnabled
                                        style={{
                                            flex: 1, borderRadius: 8,
                                            display: !loadedImages[city.images[0]] ? 'none' : 'flex',
                                        }}
                                    />
                                </View>
                            </>
                        </TouchableRipple>
                    )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen