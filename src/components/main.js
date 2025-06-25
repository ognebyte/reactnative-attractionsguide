import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { View, Alert } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

import { getAsyncStorage, setAsyncStorage } from '@/features/AsyncStorage';
import { authStateListener, getCollection, getDocById, getDocumentsFromCollection } from '@/firebase/firebaseService';
import { setCity } from "@/features/store/citySlice";
import { setAttractions } from "@/features/store/attractionsSlice";
import { setCategories } from "@/features/store/categoriesSlice";
import { clearUser, setLoading, setUser } from '@/features/store/userSlice';

import CitySelectScreen from './Layouts/CitySelectScreen';
import Home from './Home/home';
import Map from './Map/map';

SplashScreen.preventAutoHideAsync();

const Main = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const customTheme = useTheme();
    const dispatch = useDispatch();
    const currentCity = useSelector((state) => state.city);
    const [index, setIndex] = useState(0);

    const routes = [
        { key: 'home', title: 'Главная', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'map', title: 'Карта', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
    ];

    const renderScene = BottomNavigation.SceneMap({
        home: Home,
        map: Map,
    });

    const hasShownNoConnectionAlert = useRef(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const isOnline = state.isConnected;

            if (!isOnline && !hasShownNoConnectionAlert.current) {
                Alert.alert(
                    'Нет подключения к интернету',
                    'Проверьте соединение. Будут использоваться кэшированные данные.',
                    [{ text: 'OK' }]
                );
                setIsConnected(false);
                hasShownNoConnectionAlert.current = true;
            }

            if (isOnline) {
                hasShownNoConnectionAlert.current = false;
            }
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        initializeApp();
    }, []);

    useEffect(() => {
        if (isFirstLaunch !== null) {
            setupAuth();
        }
    }, [isFirstLaunch]);

    // вызыватся когда меняется текущий город
    useEffect(() => {
        if (currentCity?.id) {
            handleCityChange(currentCity.id);
        }
    }, [currentCity?.id]);

    const handleCityChange = async (cityId) => {
        try {
            const savedCityId = await getAsyncStorage('current-city-id');

            // если id отличается от прошлого города, сохраняем его в локальном хранилище
            if (savedCityId !== cityId) {
                await setAsyncStorage('current-city-id', cityId);
            }

            // загрузка данных
            const success = await loadCityData(cityId);

            if (!success) {
                Alert.alert('Ошибка', 'Не удалось загрузить данные для выбранного города.');
            } else {
                setIsFirstLaunch(false);
            }
        } catch (err) {
            console.error('Ошибка смены города:', err);
        }
    };

    const initializeApp = async () => {
        try {
            // Берем сохраненную id города
            const savedCityId = await getAsyncStorage('current-city-id');

            if (!savedCityId) {
                // если нет сохраненного города - показываем экран выбора города
                setIsFirstLaunch(true);
            } else {
                // в противном случае загружаем данные
                const success = await loadCityData(savedCityId);
                setIsFirstLaunch(!success);
            }
        } catch (err) {
            console.error('Ошибка инициализации:', err);
            setIsFirstLaunch(true);
        } finally {
            SplashScreen.hideAsync();
        }
    };

    const loadCityData = async (cityId) => {
        try {
            // загрузка данных из локального хранилища
            const cached = await loadDataFromStorage(cityId);

            // проверка на интернет-соединение
            if (isConnected) {
                const [city, attractions, categories] = await Promise.all([
                    getDocById('cities', cityId),
                    getDocumentsFromCollection('attractions', 'city_id', cityId),
                    getCollection('categories')
                ]);

                if (city && attractions && categories) {
                    dispatch(setCity(city));
                    dispatch(setAttractions(attractions));
                    dispatch(setCategories(categories));

                    // сохраняем данные в локальное хранилище
                    await saveDataToStorage(cityId, city, attractions, categories);
                    return true;
                }
                throw new Error('Пустые данные из Firebase');
            }

            if (cached.hasAllData) return true;

            Alert.alert('Нет данных', 'В оффлайн-режиме нет сохранённых данных.');
            return false;
        } catch (error) {
            console.error('Ошибка загрузки города:', error);
            return false;
        }
    };

    const loadDataFromStorage = async (cityId) => {
        try {
            const [storedCity, storedAttractions, storedCategories] = await Promise.all([
                getAsyncStorage(`city-${cityId}`),
                getAsyncStorage(`attractions-${cityId}`),
                getAsyncStorage('categories')
            ]);

            const hasAllData = storedCity && storedAttractions && storedCategories;

            if (hasAllData) {
                dispatch(setCity(storedCity));
                dispatch(setAttractions(storedAttractions));
                dispatch(setCategories(storedCategories));
            }

            return { hasAllData };
        } catch (err) {
            console.error('Ошибка чтения кэша:', err);
            return { hasAllData: false };
        }
    };

    const saveDataToStorage = async (cityId, city, attractions, categories) => {
        try {
            await Promise.all([
                setAsyncStorage(`city-${cityId}`, city),
                setAsyncStorage(`attractions-${cityId}`, attractions),
                setAsyncStorage('categories', categories)
            ]);
        } catch (err) {
            console.error('Ошибка сохранения кэша:', err);
        }
    };

    const setupAuth = async () => {
        // отслеживает авторизацию пользователя
        authStateListener(
            () => dispatch(setLoading(true)),

            // если пользователь авторизовался сохраняем данные
            async (user) => {
                dispatch(setUser(user));
                dispatch(setLoading(false));
                await setAsyncStorage('user-data', user);
            },

            // если пользователь вышел из аккаунта очищаем данные
            async () => {
                dispatch(clearUser());
                dispatch(setLoading(false));
                await setAsyncStorage('user-data', null);
            }
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: customTheme.colors.background }}>
            {isFirstLaunch ? (
                <CitySelectScreen />
            ) : (
                <BottomNavigation
                    navigationState={{ index, routes }}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                    sceneAnimationEnabled={true}
                    shifting
                />
            )}
        </View>
    );
};

export default Main;