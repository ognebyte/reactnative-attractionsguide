import { View } from "react-native";
import { useTheme } from 'react-native-paper';
import Skeleton from "react-native-reanimated-skeleton";


const SkeletonLoading = ({ skeletonWidth = '100%', skeletonHeight = '100%' }) => {
    const customTheme = useTheme();

    return (
        <View
            style={{ width: skeletonWidth, height: skeletonHeight }}>
            <Skeleton
                isLoading={true}
                animationDirection="horizontalRight"
                boneColor={customTheme.colors.inverseOnSurface}
                highlightColor={customTheme.colors.surfaceVariant}
                layout={[
                    { width: skeletonWidth, height: skeletonHeight }
                ]}
            />
        </View>
    )
}


export default SkeletonLoading;