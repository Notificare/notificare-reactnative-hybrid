import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RegionsProps } from '../routes';
import MapView, { Circle, LatLng, MAP_TYPES, Marker, Polygon } from 'react-native-maps';
import { useNotificare } from '../lib/notificare/hooks';
import { Colors } from '../lib/theme';
import MarkerImage from '../assets/images/map_marker.png';
import UserMarkerImage from '../assets/images/user_location.png';
import Geolocation from '@react-native-community/geolocation';

const ROTTERDAM = {
  latitude: 51.9244,
  longitude: 4.4777,
};

export const Regions: FC<RegionsProps> = ({}) => {
  const notificare = useNotificare();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [regions, setRegions] = useState<any[]>([]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    notificare
      .doCloudHostOperation('GET', '/region', { skip: '0', limit: '250' })
      .then((result) => setRegions(result.regions))
      .catch((e) => console.log(`Failed to fetch the regions: ${e}`));
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      ({ coords }) => {
        console.log(`Received a location update: ${JSON.stringify(coords)}`);
        const updateCamera = currentLocation == null;

        setCurrentLocation({ latitude: coords.latitude, longitude: coords.longitude });

        if (updateCamera) {
          mapRef.current?.animateCamera({ center: { latitude: coords.latitude, longitude: coords.longitude } });
        }
      },
      (error) => console.log(`Failed updating the current location: ${error}`),
      { enableHighAccuracy: true },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      mapType={MAP_TYPES.STANDARD}
      initialRegion={{
        latitude: ROTTERDAM.latitude,
        longitude: ROTTERDAM.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      scrollEnabled
      pitchEnabled
      rotateEnabled
      zoomControlEnabled
      zoomEnabled
      zoomTapEnabled
      toolbarEnabled
      onLayout={() => {
        if (currentLocation == null) return;
        mapRef.current?.animateCamera({
          center: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
        });
      }}
    >
      {currentLocation && (
        <Marker
          coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.longitude }}
          image={UserMarkerImage}
        />
      )}
      {regions.map((region) => {
        const center = region.geometry.coordinates;

        return (
          <Fragment key={region._id}>
            <Marker
              coordinate={{ latitude: center[1], longitude: center[0] }}
              title={region.name}
              image={MarkerImage}
            />

            {region.advancedGeometry != null ? (
              <Polygon
                coordinates={region.advancedGeometry.coordinates[0].map((c: any) => ({
                  latitude: c[1],
                  longitude: c[0],
                }))}
                fillColor={Colors.outerSpace_50A}
                strokeWidth={0}
              />
            ) : (
              <Circle
                center={{ latitude: center[1], longitude: center[0] }}
                radius={region.distance / 2}
                fillColor={Colors.outerSpace_50A}
                strokeWidth={0}
              />
            )}
          </Fragment>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({});
