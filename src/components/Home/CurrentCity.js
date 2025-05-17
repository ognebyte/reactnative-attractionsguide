import { useSelector } from "react-redux";
import { View } from "react-native";
import SkeletonLoading from "@/components/SkeletonLoading";
import ImageCarousel from "@/components/ImageCarousel";


const componentHeight = 300;


const CurrentCity = () => {
    // @ts-ignore
    const currentCity = useSelector((state) => state.city);


    return (
        <View style={{ height: componentHeight }}>
            <View style={{ flex: 1, position: 'relative' }}>
                {!currentCity ? <SkeletonLoading /> :
                    <ImageCarousel
                        images={currentCity.images}
                        height={componentHeight}
                    />
                }
            </View>
        </View>
    );
};

export default CurrentCity;