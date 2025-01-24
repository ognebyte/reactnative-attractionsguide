import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, Alert } from 'react-native';
import { IconButton, MD3Colors, SegmentedButtons, List } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';


// - standard: standard road map (default)
// - none: no map Note Not available on MapKit
// - satellite: satellite view
// - hybrid: satellite view with roads and points of interest overlayed
// - terrain: topographic view
// - mutedStandard: more subtle, makes markers/lines pop more (iOS 11.0+ only)
// - satelliteFlyover: 3D globe with satellite view (iOS 13.0+ Apple Maps only)
// - hybridFlyover: 3D globe with hybrid view (iOS 13.0+ Apple Maps only)

const mapTypes = [
    { label: "Схема", value: 'standard', style: { borderRadius: 8 } },
    { label: "Спутник", value: 'satellite', },
    { label: "Гибрид", value: 'hybrid', style: { borderRadius: 8 } },
]

const gap = 8;
const paddingHorizontal = 24;
const padding = 4;

const Map = () => {
    const insets = useSafeAreaInsets();
    const mapRef = useRef(null);
    const bottomSheetRef = useRef(null);
    const [currLocation, setCurrLocation] = useState(null);
    const [heading, setHeading] = useState(0); // Угол поворота карты
    const [mapType, setMapType] = useState(mapTypes[0].value);
    const [mapTraffic, setMapTraffic] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [zoomInterval, setZoomInterval] = useState(null);


    useEffect(() => {
        const startLocationUpdates = async () => {
            // Запрашиваем разрешение на доступ к местоположению
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Ошибка', 'Разрешение на использование местоположения отклонено.');
                return;
            }
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High, // Высокая точность
                    timeInterval: 5000, // Интервал обновления (5 секунд)
                    distanceInterval: 10, // Минимальное расстояние для обновления (10 метров)
                },
                (location) => {
                    const { latitude, longitude } = location.coords;
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


    const handlePresentModalPress = () => {
        modalVisible ? bottomSheetRef.current.close() : bottomSheetRef.current.present()
        setModalVisible(prev => !prev)
    }

    const handleMapTraffic = () => {
        setMapTraffic(prev => !prev)
    }

    const onMapPress = () => {
        if (modalVisible) {
            bottomSheetRef.current.close()
            setModalVisible(prev => !prev)
        }
    }

    const onMapRegionChange = async () => {
        let camera = await mapRef.current.getCamera()
        if (camera.heading != heading) setHeading(camera.heading)
    }

    const mapZoom = (isZoomIn) => {
        mapRef.current?.getCamera().then((camera) => {
            mapRef.current.animateCamera({ zoom: isZoomIn ? camera.zoom + 1 : camera.zoom - 1 });
        });
    }

    const startMapZoom = (isZoomIn) => {
        const interval = setInterval(() => mapZoom(isZoomIn), 400);
        setZoomInterval(interval);
    };

    const stopZoom = () => {
        clearInterval(zoomInterval);
        setZoomInterval(null);
    };

    // Сбрасываем направление на север
    const resetToNorth = () => {
        mapRef.current.animateCamera({ heading: 0 });
    };

    // Сбрасываем направление на север
    const goToCurrentLocation = () => {
        if (currLocation) {
            mapRef.current.animateCamera({
                center: {
                    latitude: currLocation.latitude,
                    longitude: currLocation.longitude,
                },
                zoom: 16
            })
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, position: 'relative' }}>
            <MapView
                ref={mapRef}
                onPress={onMapPress}
                onRegionChange={onMapRegionChange}
                style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
                mapType={mapType}
                showsTraffic={mapTraffic}
                initialRegion={{
                    latitude: 55.751244,
                    longitude: 37.618423,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.09,
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

            <View style={{ flex: 1 }}>
                <View style={{ position: 'absolute', right: padding, bottom: padding, alignItems: 'center' }}>
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
                        onPress={resetToNorth}
                        style={{
                            transform: [{ rotate: `${360 - heading}deg` }],
                        }}
                    />
                    <IconButton
                        mode='contained'
                        icon='crosshairs-gps'
                        iconColor={MD3Colors.primary0}
                        size={30}
                        onPress={goToCurrentLocation}
                    />
                </View>

                <View style={{ position: 'absolute', right: padding, top: '50%' }}>
                    <IconButton
                        mode='contained'
                        icon='plus'
                        iconColor={MD3Colors.primary0}
                        size={30}
                        onPressIn={() => mapZoom(true)}
                        onLongPress={() => startMapZoom(true)}
                        onPressOut={stopZoom}
                    />
                    <IconButton
                        mode='contained'
                        icon='minus'
                        iconColor={MD3Colors.primary0}
                        size={30}
                        onPressIn={() => mapZoom(false)}
                        onLongPress={() => startMapZoom(false)}
                        onPressOut={stopZoom}
                    />
                </View>

                <IconButton
                    mode='contained'
                    icon={modalVisible ? 'layers' : 'layers-outline'}
                    iconColor={MD3Colors.primary0}
                    size={30}
                    onPress={handlePresentModalPress}
                    style={{ position: 'absolute', right: padding, top: padding }}
                />
                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={['40%']}
                >
                    <BottomSheetView>
                        <List.Section style={{ gap: gap }}>
                            <SegmentedButtons
                                value={mapType}
                                onValueChange={setMapType}
                                buttons={mapTypes}
                                style={{ paddingHorizontal: paddingHorizontal }}
                            />
                            <List.Item
                                left={() => <List.Icon icon={mapTraffic ? 'traffic-light' : 'traffic-light-outline'} />}
                                title="Трафик"
                                onPress={handleMapTraffic}
                                style={{ paddingHorizontal: paddingHorizontal }}
                            />
                        </List.Section>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </SafeAreaView >
    );
};


export default Map;
