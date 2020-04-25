import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { withGoogleMap, GoogleMap } from "react-google-maps";
import Marker from "./Marker";
import Polyline from "./Polyline";
import Callout from "./Callout";

const GoogleMapContainer = withGoogleMap((props) => (
  <GoogleMap {...props} ref={props.handleMapMounted} />
));

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
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM
          },
            ...options
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
export {default as Marker} from './Marker';
export {default as Polyline} from './Polyline';
export {default as Callout} from './Callout';