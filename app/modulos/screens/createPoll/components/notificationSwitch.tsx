import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet } from "react-native";
import { useTheme, Text, Switch, Surface } from "react-native-paper";

type Props = {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
};

const NotificationSwitch: React.FC<Props> = ({ value, setValue }) => {
  const { colors } = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: colors.elevation.level2 }]}>
      <Text variant="bodyLarge">Notificar sobre los resultados</Text>
      <Switch value={value} onValueChange={setValue} />
    </Surface>
  );
};

export default NotificationSwitch;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
});
