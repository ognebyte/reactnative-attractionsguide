import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, } from 'react-native-maps';
import { View, Text, Alert, Animated } from 'react-native';
import { IconButton, MD3Colors } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';


const Map = () => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef(null); // Ссылка на MapView
    const [heading, setHeading] = useState(0); // Угол поворота карты
    const [currLocation, setCurrLocation] = useState(null);


    useEffect(() => {
        let locationSubscription;
        const startLocationUpdates = async () => {
            // Запрашиваем разрешение на доступ к местоположению
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ошибка', 'Разрешение на использование местоположения отклонено.');
                return;
            }

            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High, // Высокая точность
                    timeInterval: 5000, // Интервал обновления (5 секунд)
                    distanceInterval: 10, // Минимальное расстояние для обновления (10 метров)
                },
                (location) => {
                    const { latitude, longitude } = location.coords;
                    // console.log('Обновленное местоположение:', { latitude, longitude });
                    // Обновляем карту на новую позицию
                    setCurrLocation({
                        latitude: latitude,
                        longitude: longitude,
                    });
                }
            );
        };
        startLocationUpdates();
    }, []);


    // Сбрасываем направление на север
    const goToCurrentLocation = () => {
        if (currLocation) {
            mapRef.current.animateCamera({
                center: {
                    latitude: currLocation.latitude,
                    longitude: currLocation.longitude,
                },
                zoom: 16
            }, 500)
        }
    };

    // Сбрасываем направление на север
    const resetToNorth = () => {
        mapRef.current.animateCamera({ heading: 0 }, 500);
    };

    // - standard: standard road map (default)
    // - none: no map Note Not available on MapKit
    // - satellite: satellite view
    // - hybrid: satellite view with roads and points of interest overlayed
    // - terrain: topographic view
    // - mutedStandard: more subtle, makes markers/lines pop more (iOS 11.0+ only)
    // - satelliteFlyover: 3D globe with sattelite view (iOS 13.0+ Apple Maps only)
    // - hybridFlyover: 3D globe with hybrid view (iOS 13.0+ Apple Maps only)

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}
                userInterfaceStyle='dark'
                mapType='hybrid'
                showsTraffic={true}
                initialRegion={{
                    latitude: 55.751244,
                    longitude: 37.618423,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.09,
                }}
                onRegionChange={async () => {
                    let camera = await mapRef.current.getCamera()
                    if (camera.heading != heading) setHeading(camera.heading)
                    // console.log(camera)
                }}
                mapPadding={{ top: insets.top }}
                showsUserLocation={true}
                showsCompass={false}
                showsMyLocationButton={false}
                loadingEnabled
                loadingIndicatorColor="#666666"
                loadingBackgroundColor="#eeeeee"
            >
            </MapView>
            <View style={{ position: 'absolute', right: 5, bottom: 5, alignItems: 'center' }}>
                <IconButton
                    mode='contained'
                    icon={() =>
                        <Svg width="90%" height="90%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M12 2L9 12H15L12 2Z" fill="#FF0000" />
                            <Path d="M15 12L11.9908 22L9 12H15Z" fill="black" />
                        </Svg>
                    }
                    iconColor={MD3Colors.primary0}
                    size={24}
                    onPress={() => resetToNorth()}
                    style={{
                        transform: [{ rotate: `${360 - heading}deg` }],
                    }}
                />
                <IconButton
                    mode='contained'
                    icon='map-marker-outline'
                    iconColor={MD3Colors.primary0}
                    size={30}
                    onPress={() => goToCurrentLocation()}
                />
            </View>
        </View>
    );
};


export default Map;
