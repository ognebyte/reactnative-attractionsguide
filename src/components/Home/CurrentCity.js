import { useSelector } from "react-redux";
import { View } from "react-native";
import SkeletonLoading from "@/components/SkeletonLoading";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "react-native-paper";


const componentHeight = 300;


const CurrentCity = ({ navigation }) => {
    // @ts-ignore
    const currentCity = useSelector((state) => state.city);

    return (
        <View style={{ flex: 1, gap: 8, minHeight: componentHeight }}>
            {!currentCity ? <SkeletonLoading /> :
                <ImageCarousel
                    images={currentCity.images}
                    height={componentHeight}
                />
            }
            <View style={{
                paddingHorizontal: 8
            }}>
                <Button mode="contained-tonal"
                    icon='city-variant-outline'
                    onPress={() => navigation.navigate('City', { city: currentCity })}
                    style={{ borderRadius: 8 }}
                    labelStyle={{ flex: 1, textAlign: 'left' }}
                >
                    О городе
                </Button>
            </View>
        </View>
    );
};

export default CurrentCity;