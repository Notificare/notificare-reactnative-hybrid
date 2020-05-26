import React, { FC, Fragment, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RegionsProps } from '../routes';
import MapView, { Circle, MAP_TYPES, Marker, Polygon } from 'react-native-maps';
import { useNotificare } from '../lib/notificare/hooks';
import { Colors } from '../lib/theme';

const ROTTERDAM = {
  latitude: 51.9244,
  longitude: 4.4777,
};

export const Regions: FC<RegionsProps> = ({}) => {
  const notificare = useNotificare();
  const [currentLocation, setCurrentLocation] = useState();
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    notificare
      .doCloudHostOperation('GET', '/region', { skip: '0', limit: '250' })
      .then((result) => setRegions(result.regions))
      .catch((e) => console.log(`Failed to fetch the regions: ${e}`));
  }, []);

  return (
    <MapView
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
    >
      {/*{currentLocation != null && (*/}
      {/*  <Marker coordinate={{ latitude: currentLocation.latitude, longitude: currentLocation.latitude }} />*/}
      {/*)}*/}

      {regions.map((region) => {
        const center = region.geometry.coordinates;

        return (
          <Fragment key={region._id}>
            <Marker coordinate={{ latitude: center[1], longitude: center[0] }} title={region.name} />

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
