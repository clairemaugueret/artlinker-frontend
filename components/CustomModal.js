import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalStyles } from "../globalStyles";

export default function CustomModal({
  visible,
  title,
  message,
  buttons = [],
  onClose,
}) {
  const renderButtons = () => {
    if (buttons.length === 0) {
      return (
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonRedText}>OK</Text>
        </TouchableOpacity>
      );
    }

    return buttons.map((btn, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.button,
          btn.style === "destructive" && styles.destructive,
          btn.style === "cancel" && styles.cancel,
        ]}
        onPress={btn.onPress}
      >
        <Text style={globalStyles.buttonRedText}>{btn.text}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[globalStyles.h4, { textAlign: "center" }]}>
            {title}
          </Text>
          <Text style={[globalStyles.p, { textAlign: "center" }]}>
            {message}
          </Text>
          <View style={styles.buttonsContainer}>{renderButtons()}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    gap: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#B85449",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#aaa",
  },
  destructive: {
    backgroundColor: "#B85449",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
