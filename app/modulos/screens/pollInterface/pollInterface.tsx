import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Icon,
  MD3DarkTheme,
  RadioButton,
  Surface,
  Text,
} from "react-native-paper";
import { RootStackParamList } from "../../../../App";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PollInterface"
>;

type Poll = {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  state: string;
  userId: number;
};

type Option = {
  id: number;
  optionText: string;
  optionOrder: number;
};

const startPoll = {
  id: 1,
  title: "¿Cual es tu color favorito?",
  description: "Tienes unas cuantas opciones para eligir tu color favorito.",
  startDate: new Date(),
  endDate: new Date("2025-12-17T03:25:00"),
  state: "active",
  userId: 1,
};

const startOp: Option[] = [
  {
    id: 1,
    optionText: "Rojo 🟥",
    optionOrder: 1,
  },
  {
    id: 2,
    optionText: "Azul 🟦",
    optionOrder: 2,
  },
  {
    id: 3,
    optionText: "Verde 🟩",
    optionOrder: 3,
  },
];

type RemainingTime = {
  hours: number;
  minutes: number;
};

type User = {
  name: string;
  lastName: string;
  email: string;
  registration_date: Date;
  active: boolean;
};

const userExample: User = {
  name: "Juez",
  lastName: "Lopez",
  email: "juezlopez@hotmail.com",
  registration_date: new Date(),
  active: false,
};

const PollInterfaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [poll, setPoll] = useState<Poll>(startPoll);
  const [options, setOptions] = useState<Option[]>(startOp);
  const [user, setUser] = useState(userExample);
  const [remainingTime, setRemainingTime] = useState<RemainingTime | undefined>(
      undefined
    );
    const [checked, setChecked] = useState<string>("");
    const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    diffTime();
    sortOptions();
    setInterval(diffTime, 1000);
  }, []);

  const sortOptions = (): void => {
    options.sort((a, b) => a.optionOrder - b.optionOrder);
  };

  const diffTime = (): void => {
    const currentDate = new Date();
    const diff = poll.endDate.getTime() - currentDate.getTime();

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const remaining: RemainingTime = {
      hours,
      minutes,
    };
    setRemainingTime(remaining);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      <View style={styles.form}>
        <Text variant="displayMedium" style={styles.title}>
          {poll.title}
        </Text>
        <Surface
          elevation={0}
          style={[
            styles.surface,
            styles.textSuface,
            {
              justifyContent: "flex-start",
            },
          ]}
        >
          <Avatar.Text size={24} label={user.name.slice(0, 1)} />
          <Text variant="titleMedium" style={{ marginLeft: 8 }}>
            Creado por {user.name}
          </Text>
        </Surface>
        <Text variant="titleMedium" style={styles.text}>
          {poll.description}
        </Text>
        <Surface style={[styles.surface, styles.textSuface]}>
          <Text>
            <Icon
              source="calendar-start-outline"
              color={MD3DarkTheme.colors.primary}
              size={16}
            />
            <Text> Iniciado: {poll.startDate.toLocaleDateString("es")}</Text>
          </Text>
          {remainingTime && (
            <Text>
              <Icon
                source="timer-outline"
                color={MD3DarkTheme.colors.primary}
                size={16}
              />
              <Text>
                {remainingTime.hours}h {remainingTime.minutes}m restantes
              </Text>
            </Text>
          )}
        </Surface>
        <RadioButton.Group
          onValueChange={(newValue: string) => setChecked(newValue)}
          value={checked}
        >
          {options.map((v, _, { length }) => {
            return (
              <Surface key={v.optionOrder} style={styles.surface}>
                <RadioButton.Item
                  label={v.optionText}
                  value={String(v.optionOrder)}
                  disabled={hasVoted}
                />
              </Surface>
            );
          })}
        </RadioButton.Group>
        <Button mode="contained" disabled={hasVoted} style={styles.button}>
          Enviar Voto
        </Button>
        <Button mode="elevated" style={styles.button}>
          Mirar Resultados
        </Button>
      </View>
    </ScrollView>
  );
};

export default PollInterfaceScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: {
    marginTop: 16,
    marginBottom: 16,
  },
  text: {
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 20,
    paddingLeft: 22,
  },
  textSuface: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
});
