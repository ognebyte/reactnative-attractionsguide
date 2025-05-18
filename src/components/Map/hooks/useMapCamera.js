import { useRef } from 'react';

export const useMapCamera = () => {
    const mapRef = useRef(null);

    const animateToRegion = (region, duration = 1000) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(region, duration);
        }
    };

    const animateCamera = (cameraOptions) => {
        if (mapRef.current) {
            mapRef.current.animateCamera(cameraOptions);
        }
    };

    const getCamera = async () => {
        if (mapRef.current) {
            try {
                return await mapRef.current.getCamera();
            } catch (error) {
                console.warn('Error getting camera:', error);
                return null;
            }
        }
        return null;
    };

    const zoomMap = async (isZoomIn) => {
        try {
            const camera = await getCamera();
            if (camera) {
                animateCamera({ zoom: isZoomIn ? camera.zoom + 1 : camera.zoom - 1 });
            }
        } catch (error) {
            console.warn('Error zooming map:', error);
        }
    };

    return {
        mapRef,
        animateToRegion,
        animateCamera,
        getCamera,
        zoomMap,
    };
};