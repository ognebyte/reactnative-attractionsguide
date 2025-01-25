import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { View, Alert, StatusBar } from 'react-native';
import { Icon, IconButton, MD3Colors, SegmentedButtons, List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path, Rect, Circle } from 'react-native-svg';
import MapView, { Marker, Callout } from 'react-native-maps';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from "react-redux";
import iconStatue from '../../assets/icons/iconStatue';
import iconMonument from '../../assets/icons/iconMonument';
import iconMemorial from '../../assets/icons/iconMemorial';
import iconStar from '../../assets/icons/iconStar';


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
const markerSize = 54

const Map = () => {
    const mapRef = useRef(null);
    const bottomSheetMapOptionsRef = useRef(null);
    const bottomSheetMapMarkerRef = useRef(null);
    const [currLocation, setCurrLocation] = useState(null);
    const [heading, setHeading] = useState(0); // Угол поворота карты
    const [mapType, setMapType] = useState(mapTypes[0].value);
    const [mapTraffic, setMapTraffic] = useState(false);
    const [mapOptionsVisible, setMapOptionsVisible] = useState(false);
    const [mapMarkerVisible, setMapMarkerVisible] = useState(false);
    const [zoomInterval, setZoomInterval] = useState(null);

    const cities = useSelector((state) => state.cities);
    const attractions = useSelector((state) => state.attractions);
    const categories = useSelector((state) => state.categories);
    const [selectedAttraction, setSelectedAttraction] = useState(null); // Для отображения модального окна


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

    const handleMapOptionsPress = () => {
        if (mapMarkerVisible) bottomSheetMapMarkerRef.current.dismiss()
        mapOptionsVisible ? bottomSheetMapOptionsRef.current.dismiss() : bottomSheetMapOptionsRef.current.present()
    }

    const handleMapTraffic = () => {
        setMapTraffic(prev => !prev)
    }

    const onMapPress = () => {
        if (mapOptionsVisible) {
            bottomSheetMapOptionsRef.current.dismiss()
        }
        if (mapMarkerVisible) {
            bottomSheetMapMarkerRef.current.dismiss()
        }
    }

    const handleMarkerPress = (attraction) => {
        setSelectedAttraction(attraction);
        if (mapOptionsVisible) bottomSheetMapOptionsRef.current.dismiss()
        bottomSheetMapMarkerRef.current.present()
    };

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
                mapPadding={{ top: StatusBar.currentHeight }}
                showsUserLocation={true}
                showsCompass={false}
                showsMyLocationButton={false}
                showsScale={false}
                pitchEnabled={true}
                toolbarEnabled={false}
                loadingEnabled={true}
                loadingIndicatorColor="#666666"
                loadingBackgroundColor="#eeeeee"
            >
                {attractions?.map((attraction) => (
                    <Marker
                        key={attraction.id}
                        coordinate={{
                            latitude: attraction.location.latitude,
                            longitude: attraction.location.longitude,
                        }}
                        onPress={() => handleMarkerPress(attraction)}
                        tracksViewChanges={false}
                        style={{
                            opacity: selectedAttraction?.id === attraction.id ? 0.5 : 1
                        }}
                    >
                        <View style={{ position: 'relative', width: markerSize, height: markerSize, alignItems: 'center', justifyContent: 'center' }}>
                            <Svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M12 4C9.23082 4 6 5.982 6 11.0271C6 14.4504 10.6154 22.018 12 24C13.2308 22.018 18 14.6307 18 11.0271C18 5.982 14.7692 4 12 4Z"
                                    fill="black"
                                />
                            </Svg>

                            <View style={{ position: 'absolute', width: markerSize / 2, height: markerSize / 2 }}>
                                {(() => {
                                    switch (attraction.category_id) {
                                        case "statue":
                                            return iconStatue()
                                        case "monument":
                                            return iconMonument()
                                        case "memorial":
                                            return iconMemorial()
                                        default:
                                            return iconStar()
                                    }
                                })()}
                            </View>
                        </View>
                    </Marker>
                ))}
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
                    icon={mapOptionsVisible ? 'layers' : 'layers-outline'}
                    iconColor={MD3Colors.primary0}
                    size={30}
                    onPress={handleMapOptionsPress}
                    style={{ position: 'absolute', right: padding, top: padding }}
                />

                <BottomSheetModal ref={bottomSheetMapOptionsRef}
                    onChange={(index) => {
                        setMapOptionsVisible(prev => !prev)
                    }
                    }
                    enableDynamicSizing={true}
                    topInset={StatusBar.currentHeight}
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

                <BottomSheetModal ref={bottomSheetMapMarkerRef}
                    snapPoints={['40%', '100%']}
                    onChange={(index) => {
                        if (index >= 0) {
                            setMapMarkerVisible(true)
                        } else {
                            setMapMarkerVisible(false)
                            setSelectedAttraction(null)
                        }
                    }}
                    topInset={StatusBar.currentHeight}
                >
                    <BottomSheetView>
                        <Text titleVariant="titleLarge">
                            {selectedAttraction?.name}
                        </Text>
                        <Text titleVariant="bodyMedium">
                            {selectedAttraction?.description}
                        </Text>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </SafeAreaView >
    );
};


export default Map;
