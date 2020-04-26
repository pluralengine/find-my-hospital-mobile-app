import React, { Component } from "react";
import { Marker } from "react-google-maps";

class MapViewMarker extends Component {
  render() {
    const { description, title, coordinate, children, onPress, ...rest } = this.props;
    return (
      <Marker
        {...rest}
        onClick={onPress}
        title={description ? `${title}\n${description}` : title}
        position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
      >
        {children}
        </Marker>
    );
  }
}

export default MapViewMarker;
