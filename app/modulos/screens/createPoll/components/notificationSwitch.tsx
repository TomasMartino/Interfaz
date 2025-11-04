import React, { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { useTheme, Text, Switch, Surface } from "react-native-paper";

type props = {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
};

const NotificationSwitch = ({ value, setValue }: props) => {
  const { colors } = useTheme();

  return (
    <Surface
      style={{
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 20,
        paddingLeft: 22,
      }}
    >
      <Text>Notificar sobre los resultados</Text>
      <Switch value={value} onValueChange={setValue} />
    </Surface>
  );
};

export default NotificationSwitch;
