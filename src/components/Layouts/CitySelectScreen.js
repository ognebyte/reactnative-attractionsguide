import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, ScrollView } from "react-native";
import { Text, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getCollection } from '@/firebase/firebaseService';
import { setCities } from '@/features/store/citiesSlice';
import { setCity } from "@/features/store/citySlice";
import SkeletonLoading from './SkeletonLoading';
import SearchBarInput from './SearchBarInput';
import GoBackButton from './GoBackButton';
import { initialStateAttractions } from '@features/store/attractionsSlice';


const CitySelectScreen = ({ navigation = null }) => {
    const dispatch = useDispatch();
    const cities = useSelector((state) => state.cities);
    const [searchQuery, setSearchQuery] = useState('');

    const setCurrentCity = (city) => {
        dispatch(setCity(city));
        dispatch(initialStateAttractions())
        if (navigation) {
            navigation.goBack()
        }
    };

    const getCities = async () => {
        const citiesData = await getCollection("cities");
        dispatch(setCities(citiesData));
    };

    useEffect(() => {
        if (navigation)
            navigation.setOptions({ title: 'Выбор города' });
        if (!cities || cities.length === 0) {
            getCities();
        }
    }, [navigation])

    const CityItem = ({ children }) => (
        <View style={{ width: '100%', minHeight: 40 }}>
            {children}
        </View>
    );

    const filteredCities = cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
                gap: 4,
            }}>
                {!navigation ? null :
                    <GoBackButton navigation={navigation} customColor={false} />
                }
                <SearchBarInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    style={{ flex: 1 }}
                />
            </View>
            <ScrollView contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
                {!cities || cities.length === 0 ?
                    Array(5).fill(null).map((_, index) =>
                        // @ts-ignore
                        <SkeletonLoading key={`city-skeleton-${index}`} skeletonHeight={40} />
                    )
                    :
                    filteredCities.length === 0 ?
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>
                            Город не найден
                        </Text>
                        :
                        filteredCities.map((city) =>
                            <CityItem key={city.id}>
                                <TouchableRipple
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        padding: 8
                                    }}
                                    onPress={() => setCurrentCity(city)}
                                >
                                    <Text variant='bodyLarge'>{city.name}</Text>
                                </TouchableRipple>
                            </CityItem>
                        )
                }
            </ScrollView>
        </SafeAreaView>
    );
};

export default CitySelectScreen;