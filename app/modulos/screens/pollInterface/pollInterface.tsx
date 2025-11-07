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
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
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
  creator?: {
    username: string;
  };
};

type Option = {
  id: number;
  option_text: string;
  option_order: number;
};

type RemainingTime = {
  hours: number;
  minutes: number;
};

const PollInterfaceScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
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

      // Traer el email del creador
      if (pollData.creator_id_new) {
        const { data: creatorData, error: creatorError } = await supabase
          .from("user_ids")
          .select("email")
          .eq("id", pollData.creator_id_new)
          .maybeSingle();

        if (!creatorError && creatorData) {
          pollData.creator = { username: creatorData.email };
        }
      }

      setPoll(pollData);

      // Traer opciones
      const { data: optionsData, error: optionsError } = await supabase
        .from("option")
        .select("*")
        .eq("poll_id", pollId)
        .order("option_order", { ascending: true });
      if (optionsError) console.error("Error obteniendo opciones:", optionsError.message);
      else setOptions(optionsData || []);

      // Verificar si el usuario ya votó en esta encuesta
      const email = await AsyncStorage.getItem("userEmail");

      // Primero verificar en AsyncStorage (UI optimista)
      const cachedVote = await AsyncStorage.getItem(`vote_poll_${pollId}`);
      if (cachedVote) {
        setHasVoted(true);
        setChecked(cachedVote);
        console.log("Voto encontrado en caché local");
      }

      // Luego verificar en el backend
      if (email) {
        const { data: userData, error: userError } = await supabase
          .from("user_ids")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (!userError && userData) {
          const { data: voteData, error: voteError } = await supabase
            .from("vote")
            .select("option_id")
            .eq("poll_id", pollId)
            .eq("user_id", userData.id)
            .maybeSingle();

          if (!voteError && voteData) {
            setHasVoted(true);

            // Encontrar el option_order de la opción votada
            const votedOption = optionsData?.find(opt => opt.id === voteData.option_id);
            if (votedOption) {
              const optionOrder = String(votedOption.option_order);
              setChecked(optionOrder);

              // Guardar en caché local
              await AsyncStorage.setItem(`vote_poll_${pollId}`, optionOrder);
            }

            console.log("El usuario ya votó en esta encuesta");
          }
        }
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

      // 🔹 Verificar si ya votó (doble verificación)
      const { data: existingVote, error: checkError } = await supabase
        .from("vote")
        .select("id")
        .eq("poll_id", poll!.id)
        .eq("user_id", userId)
        .maybeSingle();

      if (!checkError && existingVote) {
        setHasVoted(true);
        console.warn("El usuario ya ha votado en esta encuesta");
        return;
      }

      // 🔹 Encontrar opción seleccionada
      const selectedOption = options.find(opt => String(opt.option_order) === checked);
      if (!selectedOption) throw new Error("Opción seleccionada no encontrada");

      // 🔹 Guardar en caché local primero (UI optimista)
      await AsyncStorage.setItem(`vote_poll_${poll!.id}`, checked);
      setHasVoted(true);

      // 🔹 Insertar voto en el backend
      const { error: insertError } = await supabase.from("vote").insert([
        {
          poll_id: poll!.id,
          option_id: selectedOption.id,
          user_id: userId,
        },
      ]);

      if (insertError) throw insertError;

      console.log("Voto registrado correctamente");
    } catch (err) {
      console.error("Error guardando voto:", err);
      // Si falla, revertir el caché y el estado
      await AsyncStorage.removeItem(`vote_poll_${poll!.id}`);
      setHasVoted(false);
    }
  };

  if (!poll) return <Text>Cargando encuesta...</Text>;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
        <Text variant="headlineLarge" style={styles.title}>{poll.title}</Text>

        <View style={styles.creatorContainer}>
          <Avatar.Text size={28} label={poll.creator?.username?.[0] || "U"} />
          <Text variant="bodyMedium" style={styles.creator}>
            Creado por {poll.creator?.username || "Desconocido"}
          </Text>
        </View>

        <Surface elevation={1} style={[styles.surface, styles.descriptionSurface]}>
          <Text variant="labelLarge" style={styles.sectionLabel}>Descripción</Text>
          <Text variant="bodyLarge" style={styles.descriptionText}>{poll.description}</Text>
        </Surface>

        <Surface elevation={1} style={[styles.surface, styles.textSurface]}>
          <Text variant="bodyMedium">
            <Icon source="calendar-start-outline" color={MD3DarkTheme.colors.primary} size={16} />{" "}
            Iniciado: {new Date(poll.start_time).toLocaleDateString("es")}
          </Text>
          {remainingTime && (
            <Text variant="bodyMedium">
              <Icon source="timer-outline" color={MD3DarkTheme.colors.primary} size={16} />{" "}
              {remainingTime.hours}h {remainingTime.minutes}m restantes
            </Text>
          )}
        </Surface>

        <Text variant="titleMedium" style={styles.optionsLabel}>Opciones</Text>

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
    </GradientBackground>
  );
};

export default PollInterfaceScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  form: { flex: 1, width: "100%", paddingHorizontal: 16 },
  title: { marginTop: 24, marginBottom: 16, fontWeight: "bold" },
  text: { marginBottom: 16 },
  button: { width: "100%", marginBottom: 16 },
  surface: { justifyContent: "space-between", marginBottom: 16, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  creatorContainer: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  creator: { marginLeft: 10, flex: 1 },
  textSurface: { flexDirection: "row", alignItems: "center", gap: 8 },
  descriptionSurface: { flexDirection: "column", paddingVertical: 16 },
  sectionLabel: { marginBottom: 8, color: MD3DarkTheme.colors.primary, fontWeight: "600" },
  descriptionText: { lineHeight: 22 },
  optionsLabel: { marginBottom: 12, marginTop: 4, fontWeight: "600" },
  inputHalf: { width: "48%" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
