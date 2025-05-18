import { useDispatch } from "react-redux";
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, Text } from 'react-native-paper';
import ImageCarousel from '@/components/ImageCarousel';
import GoBackButton from '@components/GoBackButton';
import { jumpTo } from "@features/store/mapSlice";


const CityScreen = ({ route, navigation }) => {
    const { city } = route.params;
    const dispatch = useDispatch();


    const handleNavigateToMap = () => {
        dispatch(jumpTo(city.location));
    };

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <GoBackButton navigation={navigation} />
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

                    <Button
                        icon="map"
                        mode="outlined"
                        onPress={handleNavigateToMap}
                        compact
                    >
                        Открыть на карте
                    </Button>

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
        </SafeAreaView>
    );
};

export default CityScreen;