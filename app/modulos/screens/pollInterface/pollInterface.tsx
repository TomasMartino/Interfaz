import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  HelperText,
  Icon,
  MD3DarkTheme,
  RadioButton,
  Surface,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AppModal from "../../Components/modal/modal";
import { RootStackParamList } from "../../../../App";

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


const startPoll: Poll = {
  id: 1,
  title: "¿Cuál es tu color favorito?",
  description: "Tienes unas cuantas opciones para elegir tu color favorito.",
  startDate: new Date(),
  endDate: new Date("2025-12-17T03:25:00"),
  state: "active",
  userId: 1,
};

const startOp: Option[] = [
  { id: 1, optionText: "Rojo 🟥", optionOrder: 1 },
  { id: 2, optionText: "Azul 🟦", optionOrder: 2 },
  { id: 3, optionText: "Verde 🟩", optionOrder: 3 },
];

const userExample: User = {
  name: "Juez",
  lastName: "López",
  email: "juezlopez@hotmail.com",
  registration_date: new Date(),
  active: true,
};


const PollInterfaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [poll, setPoll] = useState<Poll>(startPoll);
  const [options, setOptions] = useState<Option[]>([...startOp]);
  const [user, setUser] = useState<User>(userExample);
  const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: 0, minutes: 0 });
  const [checked, setChecked] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votingVisible, setVotingVisible] = useState(false);
  const [error, setError] = useState(false);

  
  const updateRemainingTime = useCallback(() => {
    const now = new Date();
    const diffMs = poll.endDate.getTime() - now.getTime();

    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    setRemainingTime({ hours, minutes });
  }, [poll.endDate]);

  
  useEffect(() => {
    setOptions((prev) => [...prev].sort((a, b) => a.optionOrder - b.optionOrder));
  }, []);

  
  useEffect(() => {
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [updateRemainingTime]);

  const handleVoting = (): void => {
    setVotingVisible(false);
    if (!checked) {
      setError(true);
      return;
    }
    setError(false);
    setHasVoted(true);
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
      
        <Text variant="displayMedium" style={styles.title}>
          {poll.title}
        </Text>

    
        <Surface elevation={0} style={[styles.surface, styles.textSurface]}>
          <Avatar.Text size={24} label={user.name[0]} />
          <Text variant="titleMedium" style={styles.creator}>
            Creado por {user.name}
          </Text>
        </Surface>

     
        <Text variant="titleMedium" style={styles.text}>
          {poll.description}
        </Text>

       
        <Surface style={[styles.surface, styles.textSurface]}>
          <Text>
            <Icon
              source="calendar-start-outline"
              color={MD3DarkTheme.colors.primary}
              size={16}
            />{" "}
            Iniciado: {poll.startDate.toLocaleDateString("es")}
          </Text>
          {remainingTime && (
            <Text>
              <Icon
                source="timer-outline"
                color={MD3DarkTheme.colors.primary}
                size={16}
              />{" "}
              {remainingTime.hours}h {remainingTime.minutes}m restantes
            </Text>
          )}
        </Surface>

        
        <RadioButton.Group onValueChange={setChecked} value={checked}>
          {options.map((opt, i) => (
            <Surface
              key={opt.id}
              style={[
                styles.surface,
                i + 1 !== options.length ? null : { marginBottom: 0 },
              ]}
            >
              <RadioButton.Item
                label={opt.optionText}
                value={String(opt.optionOrder)}
                disabled={hasVoted}
              />
            </Surface>
          ))}
        </RadioButton.Group>

        
        <HelperText type="error" visible={error}>
          Debes elegir una opción para poder votar.
        </HelperText>

       
        <Button
          mode="contained"
          disabled={hasVoted}
          onPress={() => setVotingVisible(true)}
          style={styles.button}
        >
          Enviar voto
        </Button>

        <Button
          mode="elevated"
          style={styles.button}
          onPress={() => navigation.navigate("PollResults")}
        >
          Mirar resultados
        </Button>
      </View>

      <AppModal
        visible={votingVisible}
        dismissable={false}
        onDismiss={() => setVotingVisible(false)}
      >
        <Text variant="headlineMedium" style={styles.title}>
          Confirmar voto
        </Text>
        <Text style={styles.text}>No podrás revertir tu voto.</Text>

        <View style={styles.modalButtons}>
          <Button
            mode="elevated"
            onPress={() => setVotingVisible(false)}
            style={styles.inputHalf}
          >
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleVoting} style={styles.inputHalf}>
            Confirmar
          </Button>
        </View>
      </AppModal>
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
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  creator: {
    marginLeft: 8,
  },
  textSurface: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputHalf: {
    width: "48%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
