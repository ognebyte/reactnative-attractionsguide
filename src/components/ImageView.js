import { useState } from 'react';
import { View, Image } from 'react-native';
import SkeletonLoading from './SkeletonLoading';


// const DEFAULT_IMAGE = '@/assets/images/default-attraction-image.png';
const DEFAULT_IMAGE = 'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg';


const ImageView = ({ uri, imgWrapperHeight = 120, imgWrapperStyle = null }) => {
    const [loaded, setLoaded] = useState(false);
    const imageUri = uri || DEFAULT_IMAGE;
    
    return (
        <View style={[{ height: imgWrapperHeight, borderRadius: 8, overflow: 'hidden' }, imgWrapperStyle]}>
            {!loaded && <SkeletonLoading />}
            <Image
                source={{ uri: imageUri }}
                onLoad={() => setLoaded(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    display: loaded ? 'flex' : 'none',
                }}
            />
        </View>
    );
};

export default ImageView;
