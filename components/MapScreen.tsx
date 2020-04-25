import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Callout, CalloutSubview } from 'react-native-maps';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { getPharmacies, getProvinces, getProducts } from '../api';
import useLogin from '../hooks/useLogin';
import StockBar from './StockBar';
import { ICONS } from '../styles/icons';
import { STATUS_PALETTE } from '../styles/palette';
import { Linking } from 'expo';

const DEFAULT_LATITUDE_DELTA = 0.026006060443698686;
const DEFAULT_LONGITUDE_DELTA = 0.017766952514648438;
const WIDTH = Math.round(Dimensions.get('window').width);
const CALLOUT_MAXWIDTH = 0.5 * WIDTH;

export default function MapScreen({ navigation }) {
  const [provinceItems, setProvinceItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [city, setCity] = useState();
  const [location, setLocation] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const { user, logout } = useLogin();
  const mapRef = useRef(null);
  const isLoggedIn = Boolean(user && user.email);
  const showStatusBar = isLoggedIn;

  async function moveToLocation() {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    setLocation(location.coords);
    mapRef.current.animateToRegion({
      latitude: location.coords.latitude,
      latitudeDelta: DEFAULT_LATITUDE_DELTA,
      longitude: location.coords.longitude,
      longitudeDelta: DEFAULT_LONGITUDE_DELTA,
    });
  }

  const handleGMapsLink = (url) => {
    setLoading(true)
    Linking.canOpenURL(url).then((supported)=>{
      if (supported) {
         Linking.openURL(url).then(()=>setLoading(false));
      }
    });
  };

  function generateGMapsURL(pharmacy){
    return encodeURI(`https://www.google.com/maps/search/?api=1&query=${pharmacy.address},${pharmacy.areas}`);
  }

  useEffect(() => {
    setLoading(true);
    getProvinces()
      .then((data) => {
        const items = data.map((city) => ({
          value: city,
          name: city,
        }));
        setProvinceItems(items);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (city) {
      setLoading(true);
      getPharmacies({ areas: city })
        .then((data) => {
          setPharmacies(data);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [city]);

  useEffect(() => {
    setLoading(true);
    getProducts().then((products) => {
      setProducts(products);
      setCurrentProduct(products[0]);
      setLoading(false);
    });
  }, []);

  function handleProductsButtonClick() {
    const index = products.findIndex((product) => {
      return product.id === currentProduct.id;
    });
    if (index === products.length - 1) {
      setCurrentProduct(products[0]);
    } else {
      setCurrentProduct(products[index + 1]);
    }
  }

  function renderLogin() {
    return isLoggedIn ? (
      <TouchableOpacity style={styles.loginButton} onPress={logout}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text>Entrar</Text>
      </TouchableOpacity>
    );
  }

  function pinColor(pharmacy) {
    const hasStock = pharmacy.products.some((product) => {
      return product.id === currentProduct.id;
    });
    return hasStock ? 'green' : 'red';
  }

  function isProductAvailable(pharmacy, item) {
    const productIds = pharmacy.products.map((product) => product.id);
    return productIds && productIds.some((id) => id === item.id);
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={[styles.map, { height: showStatusBar ? '80%' : '100%' }]}
        provider={'google'}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        onMapReady={moveToLocation}
      >
        {pharmacies.map((pharmacy) => {
          return (
            <Marker
              key={pharmacy.id}
              coordinate={{
                latitude: parseFloat(pharmacy.geometryLat),
                longitude: parseFloat(pharmacy.geometryLng),
              }}
              title={pharmacy.name}
              description={pharmacy.address}
              pinColor={pinColor(pharmacy)}
            >
              {/* <Callout onPress={() => handleGMapsLink(generateGMapsURL(pharmacy))}>
                <View style={styles.callout}>
                  <View style={styles.imageArea}>
                    {products.map((product) => {
                      return (
                        <View
                          key={product.id}
                          style={[
                            styles.logoArea,
                            {
                              backgroundColor: isProductAvailable(
                                pharmacy,
                                product
                              )
                                ? STATUS_PALETTE[4]
                                : STATUS_PALETTE[0],
                            },
                          ]}
                        >
                          <Image
                            key={product.id}
                            source={ICONS[product.photo]}
                            style={styles.productsImageCallout}
                          />
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.textAreaStyle}>
                    <Text style={{textTransform:'capitalize'}}>{`Farmacia ${pharmacy.name}`}</Text>
                    <Text style={{color:'blue'}}>Cómo llegar</Text>
                  </View>
                </View>
              </Callout> */}
            </Marker>
          );
        })}
      </MapView>
      <SearchableDropdown
        select
        onItemSelect={(item) => setCity(item.value)}
        containerStyle={styles.provincesSelector}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={provinceItems}
        textInputProps={{
          placeholder: 'Selecciona tu ciudad',
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      {renderLogin()}
      {showStatusBar && <StockBar style={styles.bottomBar} />}
      <TouchableOpacity
        style={[
          styles.productsButton,
          { bottom: !showStatusBar ? styles.productsButton.bottom : '30%' },
        ]}
        onPress={handleProductsButtonClick}
      >
        {currentProduct && (
          <Image
            source={ICONS[currentProduct.photo]}
            style={styles.productsButtonImage}
          />
        )}
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loginButton: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    right: 24,
    top: 24,
    height: 36
  },
  provincesSelector: {
    position: "absolute",
    left: 22,
    top: 24,
    width: 200,
    maxWidth: 250,
    maxHeight: 400,
    backgroundColor: "white",
    borderRadius: 10,
    alignContent: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  itemsContainer: {
    maxHeight: 140,
    borderRadius: 10,
  },
  formInput: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottomBar: {
    height: '20%',
    maxHeight: '20%',
    overflow: 'hidden',
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.5,
  },
  productsButton: {
    position: "absolute",
    bottom: 20,
    right: "3%",
    backgroundColor: "rgb(0, 150, 135)",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    padding: 4,
  },
  productsButtonImage: {
    width: 48,
    height: 48,
  },
  callout: {
    padding: 4,
    display: 'flex',
    justifyContent: 'center',
    maxWidth: CALLOUT_MAXWIDTH,
  },
  imageArea: {
    display: 'flex',
    flexDirection: 'row',
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 4,
  },
  logoArea: {
    borderRadius: 50,
    padding: 4,
    marginRight: 4
  },
  textAreaStyle: {
    padding: 4,
    marginBottom: 6,
  },
  productsImageCallout:{
    width: 32,
    height: 32,
  }
});
