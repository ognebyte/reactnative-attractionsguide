import { View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { useTheme } from 'react-native-paper';

const SkeletonLoading = () => {
    const customTheme = useTheme();

    return (
        <Skeleton
            isLoading={true}
            animationDirection="horizontalRight"
            boneColor={customTheme.colors.inverseOnSurface}
            highlightColor={customTheme.colors.surfaceVariant}
        >
            <View style={{ flex: 1, width: '100%', height: '100%' }} />
        </Skeleton>
    )
}


export default SkeletonLoading;