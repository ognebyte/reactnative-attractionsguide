import { useDispatch } from "react-redux";
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, Text } from 'react-native-paper';
import ImageCarousel from '@components/Layouts/ImageCarousel';
import GoBackButton from '@components/Layouts/GoBackButton';
import { setMapCoordinates } from "@features/store/mapSlice";
import GoMapButton from "@components/Layouts/GoMapButton";


const CityScreen = ({ route, navigation }) => {
    const { city } = route.params;
    const dispatch = useDispatch();


    const handleNavigateToMap = () => {
        dispatch(setMapCoordinates({
            latitude: city.location.latitude,
            longitude: city.location.longitude,
            isCity: true,
        }));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} stickyHeaderIndices={[0]}>
                <View style={{ paddingLeft: 8, paddingTop: 8 }}>
                    <GoBackButton navigation={navigation} />
                </View>

                <ImageCarousel
                    images={city.images}
                    height={300}
                />
                <View style={{ paddingVertical: 8, paddingHorizontal: 16, gap: 8 }}>
                    <Text variant="titleLarge">{city.name}</Text>

                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', gap: 4, opacity: .4 }}>
                        <Icon
                            source="map-marker"
                            size={16}
                        />
                        <Text variant="bodyLarge">
                            {city.location.latitude}, {city.location.longitude}
                        </Text>
                    </View>

                    <Text variant="titleMedium">
                        Основан:{' '}
                        <Text variant="bodyLarge">
                            {city.founded}
                        </Text>
                    </Text>

                    <Text variant="titleMedium">
                        Площадь:{' '}
                        <Text variant="bodyLarge">
                            {city.area}
                        </Text>
                    </Text>

                    <Text variant="titleMedium">
                        Население:{' '}
                        <Text variant="bodyLarge">
                            {city.population}
                        </Text>
                    </Text>

                    <Text variant="titleMedium">
                        Описание{'\n'}
                        <Text variant="bodyMedium">{city.description}</Text>
                    </Text>

                    <Text variant="titleMedium">
                        История{'\n'}
                        <Text variant="bodyMedium">{city.history}</Text>
                    </Text>
                </View>
            </ScrollView>

            <View style={{ flex: 1, position: 'absolute', zIndex: 10 }}>
            </View>
            <GoMapButton handleButton={handleNavigateToMap} />
        </SafeAreaView>
    );
};

export default CityScreen;