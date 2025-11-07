import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientBackgroundProps {
  children: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={['#000000', '#120a1f', '#1f1235', '#2d1b45']}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.gradient}
    >
      <View style={styles.noiseOverlay} />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  noiseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.05,
    // Simulación de noise con un patrón de puntos
    // Para un mejor efecto, considera usar una imagen de textura
  },
});

export default GradientBackground;
