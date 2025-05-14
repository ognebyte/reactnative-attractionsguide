import { View } from "react-native";
import { useTheme } from 'react-native-paper';
import Skeleton from "react-native-reanimated-skeleton";


const SkeletonLoading = ({ width = '100%', height = '100%' }) => {
    const customTheme = useTheme();

    return (
        <View style={{ width: width, height: height }}>
            <Skeleton
                isLoading={true}
                animationDirection="horizontalRight"
                boneColor={customTheme.colors.inverseOnSurface}
                highlightColor={customTheme.colors.surfaceVariant}
                layout={[
                    { width: width, height: height }
                ]}
            />
        </View>
    )
}


export default SkeletonLoading;