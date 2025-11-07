import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface LogoProps {
  inline?: boolean;
}

const Logo: React.FC<LogoProps> = ({ inline = false }) => {
  if (inline) {
    // Versión en línea para el header (más pequeña)
    return (
      <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
        VoxPopuli 🗣️📣
      </Text>
    );
  }

  // Versión vertical para el login
  return (
    <View style={{ alignItems: "center" }}>
      <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
        VoxPopuli
      </Text>
      <Text variant="headlineSmall" style={{ marginTop: 2 }}>
        🗣️📣
      </Text>
    </View>
  );
};

export default Logo;
