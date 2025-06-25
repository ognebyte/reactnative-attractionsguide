import { useState } from 'react';
import { View, Image } from 'react-native';
import SkeletonLoading from './SkeletonLoading';

import ImagePlaceholder from '@/assets/images/image-placeholder.png';


const ImageView = ({ uri, imgWrapperHeight = 120, imgWrapperStyle = null, borderRadius = 8 }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    return (
        <View style={[{ height: imgWrapperHeight, borderRadius: borderRadius, overflow: 'hidden' }, imgWrapperStyle]}>
            {loading && <SkeletonLoading />}
            <Image
                source={error ? ImagePlaceholder : { uri: uri }}
                onError={() => setError(true)}
                onLoad={() => setLoading(false)}
                style={{
                    width: '100%',
                    height: '100%',
                    display: !loading ? 'flex' : 'none',
                    backgroundColor: error ? '#d3d3d3' : 'transparent'
                }}
            />
        </View>
    );
};

export default ImageView;
