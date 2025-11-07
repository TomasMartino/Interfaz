import React from "react";
import { View } from "react-native";
import GradientBackground from "../gradientBackground/gradientBackground";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <GradientBackground>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </GradientBackground>
  );
};

export default ScreenWrapper;
