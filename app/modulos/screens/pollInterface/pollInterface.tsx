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
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppModal from "../../Components/modal/modal";
import { RootStackParamList } from "../../../../App";
import { supabase } from "../../../../backend/server/supabase";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PollInterface">;

type Poll = {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: "active" | "closed";
};

type Option = {
  id: number;
  option_text: string;
  option_order: number;
};

type User = {
  username: string;
  email: string;
};

type RemainingTime = {
  hours: number;
  minutes: number;
};

const PollInterfaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [remainingTime, setRemainingTime] = useState<RemainingTime>({ hours: 0, minutes: 0 });
  const [checked, setChecked] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [votingVisible, setVotingVisible] = useState(false);
  const [error, setError] = useState(false);

  const fetchPollData = useCallback(async () => {
    try {
      const storedId = await AsyncStorage.getItem("selectedPollId");
      if (!storedId) return console.warn("No se encontró ID de la encuesta");
      const pollId = parseInt(storedId, 10);

      // Traer encuesta
      const { data: pollData, error: pollError } = await supabase
        .from("poll")
        .select("*")
        .eq("id", pollId)
        .maybeSingle();
      if (pollError || !pollData) return console.error("Error obteniendo la encuesta:", pollError?.message);
      setPoll(pollData);

      // Traer opciones
      const { data: optionsData, error: optionsError } = await supabase
        .from("option")
        .select("*")
        .eq("poll_id", pollId)
        .order("option_order", { ascending: true });
      if (optionsError) console.error("Error obteniendo opciones:", optionsError.message);
      else setOptions(optionsData || []);

      // Traer usuario de AsyncStorage
      const username = await AsyncStorage.getItem("username");
      const email = await AsyncStorage.getItem("userEmail");
      if (!username || !email) {
        console.warn("No se encontraron datos del usuario en memoria");
        setUser(null);
      } else {
        setUser({ username, email });
      }

    } catch (err) {
      console.error("Error general:", err);
    }
  }, []);

  const updateRemainingTime = useCallback(() => {
    if (!poll) return;
    const now = new Date();
    const diffMs = new Date(poll.end_time).getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setRemainingTime({ hours, minutes });
  }, [poll]);

  useEffect(() => { fetchPollData(); }, [fetchPollData]);
  useEffect(() => {
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 60 * 1000);
    return () => clearInterval(interval);
  }, [updateRemainingTime]);

  const handleVoting = async () => {
    setVotingVisible(false);
    if (!checked) { setError(true); return; }
    setError(false);
    setHasVoted(true);

    try {
      // 🔹 Traer user_id desde user_ids usando el email
      const email = await AsyncStorage.getItem("userEmail");
      if (!email) throw new Error("No se encontró email del usuario");

      const { data: userData, error: userError } = await supabase
        .from("user_ids")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (userError || !userData) throw new Error("No se pudo obtener user_id");
      const userId = userData.id;

      // 🔹 Encontrar opción seleccionada
      const selectedOption = options.find(opt => String(opt.option_order) === checked);
      if (!selectedOption) throw new Error("Opción seleccionada no encontrada");

      // 🔹 Insertar voto
      await supabase.from("vote").insert([
        {
          poll_id: poll!.id,
          option_id: selectedOption.id,
          user_id: userId,
        },
      ]);

      console.log("Voto registrado correctamente");
    } catch (err) {
      console.error("Error guardando voto:", err);
    }
  };

  if (!poll) return <Text>Cargando encuesta...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text variant="displayMedium" style={styles.title}>{poll.title}</Text>

        <Surface elevation={0} style={[styles.surface, styles.textSurface]}>
          <Avatar.Text size={24} label={user?.username[0] || "U"} />
          <Text variant="titleMedium" style={styles.creator}>
            Creado por {user?.username || "Desconocido"}
          </Text>
        </Surface>

        <Text variant="titleMedium" style={styles.text}>{poll.description}</Text>

        <Surface style={[styles.surface, styles.textSurface]}>
          <Text>
            <Icon source="calendar-start-outline" color={MD3DarkTheme.colors.primary} size={16} />{" "}
            Iniciado: {new Date(poll.start_time).toLocaleDateString("es")}
          </Text>
          {remainingTime && (
            <Text>
              <Icon source="timer-outline" color={MD3DarkTheme.colors.primary} size={16} />{" "}
              {remainingTime.hours}h {remainingTime.minutes}m restantes
            </Text>
          )}
        </Surface>

        <RadioButton.Group onValueChange={setChecked} value={checked}>
          {options.map(opt => (
            <Surface key={opt.id} style={styles.surface}>
              <RadioButton.Item label={opt.option_text} value={String(opt.option_order)} disabled={hasVoted} />
            </Surface>
          ))}
        </RadioButton.Group>

        <HelperText type="error" visible={error}>Debes elegir una opción para poder votar.</HelperText>

        <Button mode="contained" disabled={hasVoted} onPress={() => setVotingVisible(true)} style={styles.button}>
          Enviar voto
        </Button>

        <Button mode="elevated" style={styles.button} onPress={() => navigation.navigate("PollResults")}>
          Mirar resultados
        </Button>
      </View>

      <AppModal visible={votingVisible} dismissable={false} onDismiss={() => setVotingVisible(false)}>
        <Text variant="headlineMedium" style={styles.title}>Confirmar voto</Text>
        <Text style={styles.text}>No podrás revertir tu voto.</Text>
        <View style={styles.modalButtons}>
          <Button mode="elevated" onPress={() => setVotingVisible(false)} style={styles.inputHalf}>Cancelar</Button>
          <Button mode="contained" onPress={handleVoting} style={styles.inputHalf}>Confirmar</Button>
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
