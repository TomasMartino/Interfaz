import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  HelperText,
  RadioButton,
  Surface,
  Text,
  MD3DarkTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AppModal from "../../Components/modal/modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PollInterface">;

type Poll = {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  creatorId: string;
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
  username: string;
  email: string;
  id?: string;
};

const startPoll: Poll = {
  id: 1,
  title: "Encuesta de ejemplo",
  description: "Descripción de ejemplo",
  startDate: new Date(),
  endDate: new Date("2025-12-17T03:25:00"),
  status: "active",
  creatorId: "",
};

const startOptions: Option[] = [
  { id: 1, optionText: "Opción 1", optionOrder: 1 },
  { id: 2, optionText: "Opción 2", optionOrder: 2 },
  { id: 3, optionText: "Opción 3", optionOrder: 3 },
];

const PollInterfaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [poll, setPoll] = useState<Poll>(startPoll);
  const [options, setOptions] = useState<Option[]>([...startOptions]);
  const [user, setUser] = useState<User | null>(null);
  const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: 0, minutes: 0 });
  const [checked, setChecked] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votingVisible, setVotingVisible] = useState(false);
  const [error, setError] = useState(false);

  // 🔹 Calcular tiempo restante
  const updateRemainingTime = useCallback(() => {
    const now = new Date();
    const diffMs = poll.endDate.getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setRemainingTime({ hours, minutes });
  }, [poll.endDate]);

  // 🔹 Ordenar opciones
  useEffect(() => {
    setOptions((prev) => [...prev].sort((a, b) => a.optionOrder - b.optionOrder));
  }, []);

  // 🔹 Actualizar tiempo cada minuto
  useEffect(() => {
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [updateRemainingTime]);

  // 🔹 Traer usuario creador desde AsyncStorage
  useEffect(() => {
    const fetchUserFromMemory = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        const email = await AsyncStorage.getItem("userEmail");
        const userId = await AsyncStorage.getItem("userId"); // opcional si guardaste el id

        if (!username || !email) {
          console.warn("No se encontraron datos del usuario en memoria");
          setUser(null);
        } else {
          setUser({ username, email, id: userId || "" });
        }
      } catch (err) {
        console.error("Error recuperando usuario de memoria:", err);
      }
    };

    fetchUserFromMemory();
  }, []);

  const handleVoting = (): void => {
    setVotingVisible(false);
    if (!checked) {
      setError(true);
      return;
    }
    setError(false);
    setHasVoted(true);
    // Aquí podrías guardar la votación en Supabase si quisieras
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text variant="displayMedium" style={styles.title}>
          {poll.title}
        </Text>

        {user && (
          <Surface elevation={0} style={[styles.surface, styles.textSurface]}>
            <Avatar.Text size={24} label={user.username[0]} />
            <Text variant="titleMedium" style={styles.creator}>
              Creado por {user.username}
            </Text>
          </Surface>
        )}

        <Text variant="titleMedium" style={styles.text}>
          {poll.description}
        </Text>

        <Surface style={[styles.surface, styles.textSurface]}>
          <Text>
            Inicio: {poll.startDate.toLocaleDateString("es")}
          </Text>
          {remainingTime && (
            <Text>
              {remainingTime.hours}h {remainingTime.minutes}m restantes
            </Text>
          )}
        </Surface>

        <RadioButton.Group onValueChange={setChecked} value={checked}>
          {options.map((opt, i) => (
            <Surface
              key={opt.id}
              style={[styles.surface, i + 1 !== options.length ? null : { marginBottom: 0 }]}
            >
              <RadioButton.Item label={opt.optionText} value={String(opt.optionOrder)} disabled={hasVoted} />
            </Surface>
          ))}
        </RadioButton.Group>

        <HelperText type="error" visible={error}>
          Debes elegir una opción para poder votar.
        </HelperText>

        <Button mode="contained" disabled={hasVoted} onPress={() => setVotingVisible(true)} style={styles.button}>
          Enviar voto
        </Button>

        <Button mode="elevated" style={styles.button} onPress={() => navigation.navigate("PollResults")}>
          Mirar resultados
        </Button>
      </View>

      <AppModal visible={votingVisible} dismissable={false} onDismiss={() => setVotingVisible(false)}>
        <Text variant="headlineMedium" style={styles.title}>
          Confirmar voto
        </Text>
        <Text style={styles.text}>No podrás revertir tu voto.</Text>

        <View style={styles.modalButtons}>
          <Button mode="elevated" onPress={() => setVotingVisible(false)} style={styles.inputHalf}>
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
  container: { flexGrow: 1 },
  form: { flex: 1, width: "100%", paddingHorizontal: 16 },
  title: { marginTop: 16, marginBottom: 16 },
  text: { marginBottom: 16 },
  button: { width: "100%", marginBottom: 16 },
  surface: { justifyContent: "space-between", marginBottom: 16, borderRadius: 20, paddingHorizontal: 22, paddingVertical: 12 },
  creator: { marginLeft: 8 },
  textSurface: { flexDirection: "row", alignItems: "center" },
  inputHalf: { width: "48%" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
