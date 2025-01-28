import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';


const Pagination = ({ progress, index }) => {
    const customTheme = useTheme();

    const animatedStyle = useAnimatedStyle(() => {
        const width = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [8, 16, 8], // Ширина полоски: увеличивается у активного элемента
            'clamp'
        );

        const opacity = interpolate(
            progress.value,
            [index - 1, index, index + 1],
            [0.5, 1, 0.5], // Прозрачность полоски
            'clamp'
        );

        return {
            width,
            opacity,
            backgroundColor: customTheme.colors.onSurface,
        };
    });

    return <Animated.View style={[{ height: 2 }, animatedStyle]} />;
}


export default Pagination;