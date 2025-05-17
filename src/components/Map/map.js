// @ts-ignore
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Location from 'expo-location';
import { useSelector } from "react-redux";
import { View, Alert, StatusBar, Linking, StyleSheet, Image, ScrollView } from 'react-native';
import { Icon, IconButton, SegmentedButtons, List, Text, useTheme } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { darkMapStyle } from "./mapStyles";

import SkeletonLoading from '@/components/SkeletonLoading';
import iconStatue from '@/assets/icons/iconStatue';
import iconMonument from '@/assets/icons/iconMonument';
import iconMemorial from '@/assets/icons/iconMemorial';
import iconStar from '@/assets/icons/iconStar';
import iconMarker from '@/assets/icons/iconMarker';
import iconStreet from '@/assets/icons/iconStreet';
import iconArchitecture from '@/assets/icons/iconArchitecture';
import iconMuseum from '@/assets/icons/iconMuseum';
import iconTemple from '@/assets/icons/iconTemple';


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
    const customTheme = useTheme();
    const styles = StyleSheet.create({
        bottomSheetModalBackground: {
            backgroundColor: customTheme.colors.elevation.level3
        },
    });

    const markerColor = customTheme.colors.secondaryContainer
    const markerIconColor = customTheme.colors.secondary

    const mapRef = useRef(null);
    const bottomSheetMapOptionsRef = useRef(null);
    const bottomSheetMapMarkerRef = useRef(null);

    const [gpsEnabled, setGpsEnabled] = useState(false); // Статус GPS
    const [currLocation, setCurrLocation] = useState(null); // Статус GPS

    const [heading, setHeading] = useState(0); // Угол поворота карты
    const [mapType, setMapType] = useState(mapTypes[0].value);
    const [mapTraffic, setMapTraffic] = useState(false);
    const [mapPoi, setMapPoi] = useState(true);
    const [mapOptionsVisible, setMapOptionsVisible] = useState(false);
    const [mapMarkerVisible, setMapMarkerVisible] = useState(false);
    const [zoomInterval, setZoomInterval] = useState(null);

    // @ts-ignore
    const currentCity = useSelector((state) => state.city);
    // @ts-ignore
    const attractions = useSelector((state) => state.attractions);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        if (currentCity?.location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: currentCity.location.latitude,
                longitude: currentCity.location.longitude,
                latitudeDelta: 0.25,
                longitudeDelta: 0.25,
            }, 1000); // 1000ms — анимация
        }
    }, [currentCity]);

    const handleImageLoad = (imageUri) => {
        setLoadedImages((prevState) => ({
            ...prevState,
            [imageUri]: true,
        }));
    };

    const mapStyle = useMemo(() => {
        return [
            ...(customTheme.dark ? darkMapStyle : []),
            {
                featureType: "poi",
                stylers: [{ visibility: mapPoi ? "on" : "off" }],
            },
        ];
    }, [customTheme.dark, mapPoi]);

    // Проверка GPS и запрос разрешений
    const checkGpsStatus = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Разрешение отклонено",
                "Для работы приложения необходимо включить разрешение на использование GPS.",
                [
                    { text: "Отмена", style: "cancel" },
                    { text: "Открыть настройки", onPress: () => Linking.openSettings() },
                ]
            );
            return false;
        }
        const gpsEnabled = await Location.hasServicesEnabledAsync()

        if (!gpsEnabled) Alert.alert(
            "GPS отключен",
            "Пожалуйста, включите GPS в настройках устройства.",
            [{ text: "OK" }]
        );
        setGpsEnabled(gpsEnabled)
        return gpsEnabled
    };

    const handleMapOptionsPress = () => {
        if (mapMarkerVisible) bottomSheetMapMarkerRef.current.dismiss()
        mapOptionsVisible ? bottomSheetMapOptionsRef.current.dismiss() : bottomSheetMapOptionsRef.current.present()
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

    // @ts-ignore

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
    const goToCurrentLocation = async () => {
        if (await checkGpsStatus() && currLocation) {
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
                // @ts-ignore
                mapType={mapType}
                style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'transparent' }}
                customMapStyle={mapStyle}
                showsTraffic={mapTraffic}
                showsPointsOfInterest={mapPoi}
                onUserLocationChange={({ nativeEvent }) => setCurrLocation(nativeEvent.coordinate)}
                initialRegion={{
                    latitude: 46.33255681298829,
                    latitudeDelta: 74.06192509464654,
                    longitude: 96.50912079960108,
                    longitudeDelta: 72.32142426073551
                }}
                // @ts-ignore
                mapPadding={{ top: StatusBar.currentHeight }}
                showsUserLocation={true}
                showsCompass={false}
                showsMyLocationButton={false}
                renderToHardwareTextureAndroid={true}
                showsScale={false}
                toolbarEnabled={false}
                loadingEnabled={true}
                loadingIndicatorColor={customTheme.colors.primary}
                loadingBackgroundColor={customTheme.colors.background}
            >
                {attractions?.map((attraction) => (
                    <Marker
                        key={attraction.id}
                        coordinate={{
                            latitude: attraction.location.latitude,
                            longitude: attraction.location.longitude,
                        }}
                        onPress={() => handleMarkerPress(attraction)}
                        style={{
                            opacity: selectedAttraction?.id === attraction.id ? 0.6 : 1
                        }}
                        tracksViewChanges={false}
                    >
                        <View style={{
                            position: 'relative',
                            width: markerSize, height: markerSize,
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            {iconMarker(markerColor, markerIconColor)}
                            <View style={{ position: 'absolute', width: markerSize / 2, height: markerSize / 2 }}>
                                {(() => {
                                    switch (attraction.category) {
                                        case "statue":
                                            return iconStatue(markerIconColor)
                                        case "monument":
                                            return iconMonument(markerIconColor)
                                        case "memorial":
                                            return iconMemorial(markerIconColor)
                                        case "street":
                                            return iconStreet(markerIconColor)
                                        case "architecture":
                                            return iconArchitecture(markerIconColor)
                                        case "museum":
                                            return iconMuseum(markerIconColor)
                                        case "temple":
                                            return iconTemple(markerIconColor)
                                        default:
                                            return iconStar(markerIconColor)
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
                            <Svg width="90%" height="90%" viewBox="0 0 24 24" fill="none"
                                // @ts-ignore
                                xmlns="http://www.w3.org/2000/svg">
                                <Path d="M12 2L9 12H15L12 2Z" fill="#FF0000" />
                                <Path d="M15 12L11.9908 22L9 12H15Z" fill="black" />
                            </Svg>
                        }
                        size={24}
                        onPress={resetToNorth}
                        style={{
                            transform: [{ rotate: `${360 - heading}deg` }],
                        }}
                    />
                    <IconButton
                        mode='contained'
                        icon={gpsEnabled ? "crosshairs-gps" : "crosshairs-question"}
                        size={30}
                        onPress={goToCurrentLocation}
                    />
                </View>

                <View style={{ position: 'absolute', right: padding, top: '50%' }}>
                    <IconButton
                        mode='contained'
                        icon='plus'
                        size={30}
                        onPressIn={() => mapZoom(true)}
                        onLongPress={() => startMapZoom(true)}
                        onPressOut={stopZoom}
                    />
                    <IconButton
                        mode='contained'
                        icon='minus'
                        size={30}
                        onPressIn={() => mapZoom(false)}
                        onLongPress={() => startMapZoom(false)}
                        onPressOut={stopZoom}
                    />
                </View>

                <IconButton
                    mode='contained'
                    icon={mapOptionsVisible ? 'layers' : 'layers-outline'}
                    size={30}
                    onPress={handleMapOptionsPress}
                    style={{ position: 'absolute', right: padding, top: padding }}
                />

                <BottomSheetModal ref={bottomSheetMapOptionsRef}
                    // @ts-ignore
                    onChange={(index) => setMapOptionsVisible(prev => !prev)}
                    enableDynamicSizing={true}
                    topInset={StatusBar.currentHeight}
                    backgroundStyle={styles.bottomSheetModalBackground}
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
                                left={() =>
                                    <List.Icon
                                        icon={mapTraffic ? 'traffic-light' : 'traffic-light-outline'}
                                    />
                                }
                                title="Пробки"
                                onPress={() => setMapTraffic(prev => !prev)}
                                style={{
                                    paddingHorizontal: paddingHorizontal,
                                    backgroundColor: mapTraffic ? customTheme.colors.secondaryContainer : undefined,
                                }}
                            />
                            <List.Item
                                left={() =>
                                    <List.Icon
                                        icon={mapPoi ? 'star-four-points' : 'star-four-points-outline'}
                                    />
                                }
                                title="Точки интереса"
                                onPress={() => setMapPoi(prev => !prev)}
                                style={{
                                    paddingHorizontal: paddingHorizontal,
                                    backgroundColor: mapPoi ? customTheme.colors.secondaryContainer : undefined,
                                }}
                            />
                        </List.Section>
                    </BottomSheetView>
                </BottomSheetModal>

                <BottomSheetModal ref={bottomSheetMapMarkerRef}
                    enableContentPanningGesture={false}
                    enableDynamicSizing={true}
                    // snapPoints={['40%', '100%']}
                    onChange={(index) => {
                        if (index >= 0) {
                            setMapMarkerVisible(true)
                        } else {
                            setMapMarkerVisible(false)
                            setSelectedAttraction(null)
                        }
                    }}
                    topInset={StatusBar.currentHeight}
                    backgroundStyle={styles.bottomSheetModalBackground}
                >
                    <BottomSheetView>
                        <View style={{ gap: 16, paddingTop: 4, paddingBottom: 24 }}>

                            <Text variant='titleLarge' numberOfLines={2}
                                style={{ paddingHorizontal: 16 }}
                            >
                                {selectedAttraction?.name}
                            </Text>

                            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 8 }}>
                                <ScrollView
                                    horizontal={true}
                                    contentContainerStyle={{ padding: 8, gap: 8 }}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {selectedAttraction?.images.map((image) =>
                                        <View key={"map-attraction-image-" + image}
                                            style={{ width: 128, height: 128 }}
                                        >
                                            {!loadedImages[image] && (<SkeletonLoading />)}
                                            <Image
                                                source={{ uri: image }}
                                                // @ts-ignore
                                                width={'100%'} height={'100%'}
                                                onLoad={() => handleImageLoad(image)}
                                                style={{
                                                    borderRadius: 8,
                                                    display: !loadedImages[image] ? 'none' : 'flex',
                                                }}
                                            />
                                        </View>
                                    )}
                                </ScrollView>
                            </View>

                            <Text variant="bodyMedium"
                                style={{ paddingHorizontal: 16 }}
                            >
                                {selectedAttraction?.description}
                            </Text>
                            <Text variant="bodyMedium"
                                style={{ paddingHorizontal: 16 }}
                            >
                                {selectedAttraction?.history}
                            </Text>
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </SafeAreaView >
    );
};


export default Map;
