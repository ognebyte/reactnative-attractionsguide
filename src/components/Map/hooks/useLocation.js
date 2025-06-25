import { useState } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export const useLocation = () => {
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [currLocation, setCurrLocation] = useState(null);

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

        const isGpsEnabled = await Location.hasServicesEnabledAsync();

        if (!isGpsEnabled) {
            await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });
        }

        setGpsEnabled(isGpsEnabled);
        return isGpsEnabled;
    };

    return {
        gpsEnabled,
        currLocation,
        setCurrLocation,
        checkGpsStatus,
    };
};