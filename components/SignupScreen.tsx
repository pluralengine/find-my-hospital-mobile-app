import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import { getProvinces, createUser, getPharmacies } from "../api";

export default function SignupScreen({ navigation }) {
  const [provinceItems, setProvinceItems] = useState([]);
  const [pharmacyItems, setPharmacyItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [province, setProvince] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [centerCode, setCenterCode] = useState("");

  useEffect(() => {
    setLoading(true);
    getProvinces()
      .then((data) => {
        const items = data.map((province) => ({
          value: province,
          name: province,
        }));
        setProvinceItems(items);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (province) {
      setLoading(true);
      getPharmacies(province)
        .then((data) => {
          const items = data.map((pharmacy) => ({
            value: pharmacy.id,
            name: pharmacy.name,
          }));
          console.log("data",data);
          setPharmacyItems(items);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [province]);

  function submitUser() {
    createUser({
      name,
      email,
      password,
      pharmacyId: pharmacy.value,
    }).then((user) => {
      Alert.alert(
        "Enviado correctamente",
        `Gracias ${user.name}. Estamos comprobando sus datos.\n\nPronto recibirá un email a ${user.email} confirmando su alta`,
        [
          {
            text: "Aceptar",
            onPress: () => {
              navigation.navigate("Login");
            },
          },
        ],
        { cancelable: false }
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        Pedir acceso como personal de farmacia
      </Text>
      <Text style={styles.formSubtitle}>
        Por el momento, solo personal del un usuario por farmacia podrá informar
        del inventario de productos.
      </Text>
      <SearchableDropdown
        select
        onItemSelect={(item) => {
          setProvince(item.value);
        }}
        containerStyle={styles.searchInput}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={provinceItems}
        textInputProps={{
          placeholder: loading ? "Cargando..." : "Provincia",
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <SearchableDropdown
        select
        disabled={!province}
        onItemSelect={(item) => {
          setPharmacy(item.value);
        }}
        containerStyle={styles.searchInput}
        itemStyle={styles.dropdownItem}
        itemsContainerStyle={styles.itemsContainer}
        items={pharmacyItems}
        textInputProps={{
          placeholder: loading ? "Cargando..." : "Farmacia",
          style: styles.formInput,
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Código Autonómico del Centro"
        onChangeText={(centerCode) => setCenterCode(centerCode)}
        defaultValue={centerCode}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Nombre y Apellidos"
        autoCompleteType="name"
        onChangeText={(name) => setName(name)}
        defaultValue={name}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Email"
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={(email) => setEmail(email)}
        defaultValue={email}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.formInput}
        placeholder="Contraseña"
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry
        onChangeText={(password) => setPassword(password)}
        defaultValue={password}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.loginButton} onPress={submitUser}>
        <Text>Pedir acceso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 48,
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 24,
  },
  formSubtitle: {
    marginBottom: 16,
  },
  formInput: {
    height: 48,
    width: "100%",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchInput: {
    width: "100%",
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  itemsContainer: {
    maxHeight: 140,
    marginTop: -14,
    marginBottom: 8,
    borderRadius: 10,
  },
  formLink: {
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#F5F5F5",
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
