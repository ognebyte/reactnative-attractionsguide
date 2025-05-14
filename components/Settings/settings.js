import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { View, Image, Dimensions, ScrollView } from 'react-native';
import { Button, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearAllAsyncStorage } from '../../features/AsyncStorage';


const Settings = () => {
    const customTheme = useTheme();

    async function clearAll() {
        await clearAllAsyncStorage()
        console.log('cleared')
    }

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <Button icon='trash-can-outline' onPress={() => clearAll()}>
                    Clear async storage
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Settings;