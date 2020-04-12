import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getHospitals } from '../api';
import useLogin from '../hooks/useLogin';

export default function MapScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const { user, logout } = useLogin();

  useEffect(() => {
    getHospitals().then(setHospitals);
  }, []);

  function renderLogin() {
    return user && user.email ? (
      <TouchableOpacity style={styles.loginButton} onPress={logout}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text>¿Eres personal sanitario?</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={'google'}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: parseFloat(hospital.geometryLat),
              longitude: parseFloat(hospital.geometryLng),
            }}
            title={hospital.name}
            description={hospital.address}
          />
        ))}
      </MapView>
      {renderLogin()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loginButton: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#F5F5F5',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    right: 24,
    top: 24,
  },
});
