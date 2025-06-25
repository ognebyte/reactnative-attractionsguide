import { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView, } from '@gorhom/bottom-sheet';
import getCategoryNameById from '@utils/getCategoryNameById';
import { Button, Text, Divider } from 'react-native-paper';
import ImageView from '@components/Layouts/ImageView';


const AttractionBottomSheet = forwardRef(({
    theme,
    selectedAttraction,
    categories,
    navigate,
    onRouteOptionsOpen,
    onClose
}, ref) => {

    return (
        <BottomSheetModal ref={ref} enableDynamicSizing={true} onDismiss={onClose} backgroundStyle={{ backgroundColor: theme.colors.elevation.level3 }}>
            <BottomSheetView style={styles.contentContainer}>
                {selectedAttraction && (
                    <View style={styles.attractionPreview}>
                        {/* Превью достопримечательности */}
                        <View style={styles.attractionHeader}>
                            <View style={styles.attractionImageContainer}>
                                <ImageView uri={selectedAttraction.images[0]} imgWrapperHeight='100%'/>
                            </View>

                            <View style={{ flex: 1, gap: 4 }}>
                                <Text variant='bodyLarge' style={{ color: theme.colors.onSurface }} numberOfLines={2}>
                                    {selectedAttraction.name}
                                </Text>
                                <Text variant='bodyMedium' style={{ color: theme.colors.onSurfaceVariant }}>
                                    {getCategoryNameById(categories, selectedAttraction.category)}
                                </Text>
                                {selectedAttraction.description && (
                                    <Text variant='bodySmall' style={{ marginTop: 'auto', color: theme.colors.onSurfaceVariant }} numberOfLines={2}>
                                        {selectedAttraction.description}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <Divider />
                        {/* Кнопки действия */}
                        <View style={styles.actionButtons}>
                            <Button mode='contained' icon='directions' onPress={onRouteOptionsOpen} style={{ flex: 1 }}>
                                Маршрут
                            </Button>

                            <Button mode='outlined' icon='information' onPress={navigate} style={{ flex: 1 }}>
                                Подробнее
                            </Button>
                        </View>
                    </View>
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },

    attractionPreview: {
        gap: 12,
    },

    attractionHeader: {
        flexDirection: 'row',
        gap: 12,
    },

    attractionImageContainer: {
        width: 100,
        height: 100
    },

    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
});

AttractionBottomSheet.displayName = 'AttractionBottomSheet';

export default AttractionBottomSheet;