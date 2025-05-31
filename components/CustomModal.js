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
    //Si on ne fait pas passer d'information sur les boutons dans les props
    // alors pas défaut c'est un bouton "OK" avec la fonctionnalité "onClose" (que l'on a passé dans les props)
    if (buttons.length === 0) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={globalStyles.buttonRed}
          onPress={onClose}
        >
          <Text style={globalStyles.buttonRedText}>OK</Text>
        </TouchableOpacity>
      );
    }

    // Et sinon on traite les boutons via les props que l'on a passé
    // à savoir, leur text spécifique, leur style spécifique (si il y en a un), et leurs actions spécifiques de onPress
    // ex. boutons "Oui" / "Non" de l'écran AccountInfoScreen pour abanbonner les modifications
    return buttons.map((btn, index) => (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        style={[
          globalStyles.buttonRed,
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
  cancel: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
