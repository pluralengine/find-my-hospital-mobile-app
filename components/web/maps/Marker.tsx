import React, { Component } from 'react';
import { Marker } from 'react-google-maps';

class MapViewMarker extends Component {
  render() {
    const {
      description,
      title,
      coordinate,
      children,
      onPress,
      pinColor,
      ...rest
    } = this.props;
    let url = `http://maps.google.com/mapfiles/ms/icons/${pinColor}-dot.png`;
    return (
      <Marker
        {...rest}
        onClick={onPress}
        title={description ? `${title}\n${description}` : title}
        position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
        icon={url}>
        {children}
      </Marker>
    );
  }
}

export default MapViewMarker;
