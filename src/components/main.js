import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';

import { getAsyncStorage, setAsyncStorage } from '@/features/AsyncStorage';
import { getCollection, getDocById, getDocumentsFromCollection } from '@/firebase/firebaseService';

import { setCity } from "@/features/store/citySlice";
import { setAttractions } from "@/features/store/attractionsSlice";
import { setCategories } from "@/features/store/categoriesSlice";

import CitySelectScreen from './CitySelectScreen';
import Home from './Home/home';
import Map from './Map/map';
import Settings from './Settings/settings';


SplashScreen.preventAutoHideAsync(); // предотвратить авто-скрытие


const Main = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const customTheme = useTheme();
    const dispatch = useDispatch();
    // @ts-ignore
    const currentCity = useSelector((state) => state.city);
    const [index, setIndex] = useState(0);
    const routes = [
        { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'map', title: 'Map', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
        // { key: 'settings', title: 'Settings', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
    ];
    const renderScene = BottomNavigation.SceneMap({
        home: Home,
        map: Map,
        // settings: Settings,
    });


    useEffect(() => {
        if (isFirstLaunch != null) {
            SplashScreen.hideAsync();
        }
    }, [isFirstLaunch]);

    useEffect(() => {
        checkAppLaunch();
    }, []);

    useEffect(() => {
        if (currentCity?.id) {
            setAsyncStorage('current-city-id', currentCity.id);
            loadCityRelatedData(currentCity.id);
            setIsFirstLaunch(false);
        }
    }, [currentCity]);

    const checkAppLaunch = async () => {
        try {
            const cityId = await getAsyncStorage('current-city-id');
            if (!cityId) {
                setIsFirstLaunch(true);
            } else {
                loadEssentialData(cityId);
                setIsFirstLaunch(false);
            }
        } catch (err) {
            setIsFirstLaunch(true);
            console.error(err);
        }
    };


    const loadEssentialData = async (cityId) => {
        try {
            const [city, attractionsData, categoriesData] = await Promise.all([
                getDocById('cities', cityId),
                getDocumentsFromCollection('attractions', 'city_id', cityId),
                getCollection('categories'),
            ]);
            dispatch(setCity(city))
            dispatch(setAttractions(attractionsData));
            dispatch(setCategories(categoriesData));
        } catch (err) {
            console.error(err);
        }
    };

    const loadCityRelatedData = async (cityId) => {
        try {
            const [attractionsData, categoriesData] = await Promise.all([
                getDocumentsFromCollection('attractions', 'city_id', cityId),
                getCollection("categories"),
            ]);
            dispatch(setAttractions(attractionsData));
            dispatch(setCategories(categoriesData));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: customTheme.colors.background }}>
            {
                isFirstLaunch ?
                    <CitySelectScreen />
                    :
                    <BottomNavigation
                        navigationState={{ index, routes }}
                        onIndexChange={setIndex}
                        renderScene={renderScene}
                        sceneAnimationEnabled={true}
                        sceneAnimationType={'opacity'}
                        shifting={true}
                    />
            }
        </View>
    );
};

export default Main;