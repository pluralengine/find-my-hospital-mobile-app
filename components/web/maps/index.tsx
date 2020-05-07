import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps";
import Marker from "./Marker";
import Polyline from "./Polyline";
import Callout from "./Callout";

const GoogleMapContainer = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap {...props} ref={props.handleMapMounted} />
  ))
);

class MapView extends Component {
  state = {
    center: null,
  };

  handleMapMounted = (map) => {
    this.map = map;
    this.props.onMapReady && this.props.onMapReady();
  };

  animateToRegion(coordinates) {
    this.setState({
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
    });
  }

  onDragEnd = () => {
    const { onRegionChangeComplete } = this.props;
    if (this.map && onRegionChangeComplete) {
      const center = this.map.getCenter();
      onRegionChangeComplete({
        latitude: center.lat(),
        longitude: center.lng(),
      });
    }
  };

  render() {
    const {
      region,
      initialRegion,
      onRegionChange,
      onPress,
      options,
    } = this.props;
    const { center } = this.state;
    const style = this.props.style || styles.container;

    const centerProps = region
      ? {
          center: {
            lat: region.latitude,
            lng: region.longitude,
          },
        }
      : center
      ? { center }
      : {
          defaultCenter: {
            lat: initialRegion && initialRegion.latitude,
            lng: initialRegion && initialRegion.longitude,
          },
        };

    return (
      <View style={style}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDCU-ru-9oAi_E-2EEljl_CdIlUY9CAnjE"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: "100%" }} />}
          mapElement={<div style={{ height: "100%" }} />}
          {...centerProps}
          onDragStart={onRegionChange}
          onIdle={this.onDragEnd}
          defaultZoom={15}
          onClick={onPress}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            ...options,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
            streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM,
            },
          }}
        >
          {this.props.children}
        </GoogleMapContainer>
      </View>
    );
  }
}

MapView.Marker = Marker;
MapView.Polyline = Polyline;
MapView.Callout = Callout;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default MapView;
export { default as Marker } from "./Marker";
export { default as Callout } from "./Callout";
