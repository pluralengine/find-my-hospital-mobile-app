import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import Emoji from "react-native-emoji";
import { vote as sendVote, getHospital } from "../api";
import useLogin from "../hooks/useLogin";

export default function VoteBar({ style }) {
  const { user } = useLogin();
  const [hospital, setHospital] = useState();

  useEffect(setUserHospitalStatus, []);

  function setUserHospitalStatus() {
    getHospital(user.hospitalId).then(setHospital);
  }

  function vote(score) {
    const percent = score * 20;

    sendVote(user, percent)
      .then(() => {
        Alert.alert("El estado del hospital ha sido reportado correctamente");
      })
      .then(setUserHospitalStatus);
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.itemsContainer}>
        <TouchableOpacity
          onPress={() => vote(1)}
          style={[styles.numberTab, { backgroundColor: "#cc3232" }]}
        >
          <Emoji style={styles.tabText} name="weary" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => vote(2)}
          style={[styles.numberTab, { backgroundColor: "#db7b2b" }]}
        >
          <Emoji style={styles.tabText} name="slightly_frowning_face" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => vote(3)}
          style={[styles.numberTab, { backgroundColor: "#e7b416" }]}
        >
          <Emoji style={styles.tabText} name="neutral_face" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => vote(4)}
          style={[styles.numberTab, { backgroundColor: "#99c140" }]}
        >
          <Emoji style={styles.tabText} name="slightly_smiling_face" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => vote(5)}
          style={[styles.numberTab, { backgroundColor: "#2dc937" }]}
        >
          <Emoji style={styles.tabText} name="grin" />
        </TouchableOpacity>
      </View>
      <View style={styles.stats}>
        <Text style={styles.hospitalName}>{hospital && hospital.name}</Text>
        <Text style={styles.capacity}>
          {hospital && hospital.status ? `${hospital.status}%` : "- %"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  itemsContainer: {
    display: "flex",
    flexDirection: "row",
    height: "50%",
    justifyContent: "space-around",
    padding: 16,
  },
  numberTab: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  tabText: {
    fontSize: 24,
  },
  tabSlider: {
    padding: 8,
  },
  stats: {
    height: "50%",
    display: "flex",
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  hospitalName: {
    flex: 1,
    textTransform: "uppercase",
    width: "50%",
    textAlign: "right",
    fontSize: 12,
  },
  capacity: {
    flex: 1,
    textTransform: "uppercase",
    width: "50%",
    textAlign: "center",
    fontSize: 40,
  },
});
