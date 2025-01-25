import { useState, useEffect } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { collection, query, where, getDocs, setDoc, addDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setCities } from "../features/citiesSlice";
import { setAttractions } from "../features/attractionsSlice";
import { setCategories } from "../features/categoriesSlice";

import Map from './Map/map';
import Home from './Home/home';


const Main = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
        { key: 'map', title: 'Map', focusedIcon: 'map', unfocusedIcon: 'map-outline' },
    ]);
    const dispatch = useDispatch();


    useEffect(() => {
        setReduxData()
    }, []);

    const getData = async (name) => {
        const dataRef = await getDocs(collection(FIREBASE_DB, name));
        return dataRef.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    const setReduxData = async () => {
        try {
            const [citiesData, attractionsData, categoriesData] = await Promise.all([
                getData("cities"),
                getData("attractions"),
                getData("categories"),
            ]);
            dispatch(setCities(citiesData));
            dispatch(setAttractions(attractionsData));
            dispatch(setCategories(categoriesData));
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    }

    const renderScene = BottomNavigation.SceneMap({
        home: Home,
        map: Map
    });


    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            sceneAnimationEnabled={true}
            sceneAnimationType={'opacity'}
            shifting={true}
        />
    );
};

export default Main;