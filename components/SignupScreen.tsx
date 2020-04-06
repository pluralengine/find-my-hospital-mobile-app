import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert
} from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import { getHospitals, createUser } from "../api";

export default function SignupScreen({ navigation }) {
  const [hospitalItems, setHospitalItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hospital, setHospital] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setLoading(true);
    getHospitals()
      .then(data => {
        const items = data.map(hospital => ({
          value: hospital.id,
          name: hospital.name
        }));
        setHospitalItems(items);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  }, []);

  function submitUser() {
    createUser({
      name,
      email,
      password,
      role,
      hospitalId: hospital.value
    }).then((user) => {
      Alert.alert(
        "Enviado correctamente",
        `Gracias ${user.name}. Estamos comprobando sus datos.\n\nPronto recibirá un email a ${user.email} confirmando su alta`,
        [
          {
            text: "Aceptar",
            onPress: () => {
              navigation.navigate("Login");
            }
          }
        ],
        { cancelable: false }
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        Pedir acceso como personal del hospital
      </Text>
      <Text style={styles.formSubtitle}>
        Por el momento, solo personal del hospital podrá informar del estado de
        ocupación de Urgencias. Para verificar que usted pertenece al mismo, por
        favor rellene sus datos y verificaremos su identidad.
      </Text>
      <SearchableDropdown
        select
        onItemSelect={setHospital}
        containerStyle={styles.searchInput}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: "transparent"
        }}
        itemsContainerStyle={{ maxHeight: 140, marginTop: -16 }}
        items={hospitalItems}
        textInputProps={{
          placeholder: loading ? "Cargando..." : "Hospital",
          style: styles.formInput
        }}
        listProps={{
          nestedScrollEnabled: true
        }}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Cargo en el hospital"
        onChangeText={role => setRole(role)}
        defaultValue={role}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Nombre y Apellidos"
        autoCompleteType="name"
        onChangeText={name => setName(name)}
        defaultValue={name}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Email"
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        onChangeText={email => setEmail(email)}
        defaultValue={email}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Contraseña"
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry
        onChangeText={password => setPassword(password)}
        defaultValue={password}
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
    padding: 48
  },
  formTitle: {
    fontSize: 24,
    marginBottom: 24
  },
  formSubtitle: {
    marginBottom: 16
  },
  formInput: {
    height: 48,
    width: "100%",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  searchInput: {
    width: "100%"
  },
  loginButton: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#F5F5F5",
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  formLink: {
    textDecorationLine: "underline"
  }
});
