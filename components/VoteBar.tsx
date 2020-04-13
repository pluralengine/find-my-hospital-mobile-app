import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert } from "react-native";
import Emoji from "react-native-emoji";
import { vote as sendVote, getHospital } from "../api";
import useLogin from "../hooks/useLogin";
import { STATUS_PALETTE, STATUS_EMOJIS } from "../styles/palette";

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
        {[5, 4, 3, 2, 1].map((score, idx) => {
          return <TouchableOpacity
            key={score}
            onPress={() => vote(score)}
            style={[styles.numberTab, { backgroundColor: STATUS_PALETTE[idx] }]}
          >
            <Emoji style={styles.tabText} name={STATUS_EMOJIS[idx]} />
          </TouchableOpacity>;
        })}
      </View>
      {hospital && <View style={styles.stats}>
        <Text style={styles.hospitalName}>{hospital.name}</Text>
        <View style={styles.capacity}>
          <Text style={styles.capacityValue}>
            {hospital.status ? `${hospital.status}%` : "- %"}
          </Text>
          <Text style={styles.capacityLabel}>ocupación</Text>
        </View>
      </View>}
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    flex: 1,
    textTransform: "uppercase",
    width: "50%",
    textAlign: "center",
    fontSize: 40,
  },
  capacityValue: {
    fontSize: 40,
    marginRight: 8,
  },
  capacityLabel: {
    fontSize: 12,
  },
});
