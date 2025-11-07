import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Divider,
  HelperText,
} from "react-native-paper";
import { ScrollView, View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "../../Components/datetimepicker/datetimepicker";
import OptionsForm from "./components/optionsForm";
import NotificationSwitch from "./components/notificationSwitch";
import AppModal from "../../Components/modal/modal";
import { supabase } from "../../../../backend/server/supabase";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePoll"
>;

export type option = {
  optionText: string;
};

const optionsStart: option[] = [
  { optionText: "" },
  { optionText: "" },
];

type errorsTypes = {
  titleEmpty: boolean;
  descriptionEmpty: boolean;
  startEmpty: boolean;
  endEmpty: boolean;
  sameDate: boolean;
  endBeforeStart: boolean;
  optionsEmpty: boolean;
};

const errorsStart: errorsTypes = {
  titleEmpty: false,
  descriptionEmpty: false,
  startEmpty: false,
  endEmpty: false,
  sameDate: false,
  endBeforeStart: false,
  optionsEmpty: false,
};

const CreatePollScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [options, setOptions] = useState<option[]>(optionsStart);
  const [notify, setNotify] = useState(false);
  const [errors, setErrors] = useState<errorsTypes>(errorsStart);
  const [resetVisible, setResetVisible] = useState(false);
  const [submitVisible, setSubmitVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = (): void => {
    setResetVisible(false);
    setTitle("");
    setDescription("");
    setStartTime(null);
    setEndTime(null);
    setOptions(optionsStart);
  };

  const findErrors = (): boolean => {
    let foundErrors: errorsTypes = { ...errorsStart };
    if (!title) foundErrors.titleEmpty = true;
    if (!description) foundErrors.descriptionEmpty = true;
    if (!startTime || !endTime) {
      foundErrors.startEmpty = !startTime;
      foundErrors.endEmpty = !endTime;
    } else {
      if (endTime < startTime) foundErrors.endBeforeStart = true;
      if (endTime.getTime() === startTime.getTime()) foundErrors.sameDate = true;
    }
    foundErrors.optionsEmpty = options.some((o) => o.optionText.trim() === "");
    setErrors(foundErrors);
    return Object.values(foundErrors).includes(true);
  };

  const handleSubmit = async (): Promise<void> => {
    setSubmitVisible(false);
    setLoading(true);

    if (findErrors()) {
      setLoading(false);
      return;
    }

    try {

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("⚠️ No hay sesión activa");
        setLoading(false);
        return;
      }


      const { data: pollData, error: pollError } = await supabase
        .from("poll")
        .insert([
          {
            title,
            description,
            start_time: startTime?.toISOString(),
            end_time: endTime?.toISOString(),
            status: "active",
            creator_id_new: userData.user.id,
          },
        ])
        .select("id")
        .single();

      if (pollError) throw pollError;


      const optionsToInsert = options.map((opt, index) => ({
        option_text: opt.optionText.trim(),
        option_order: index + 1,
        poll_id: pollData.id,
      }));

      const { error: optionError } = await supabase
        .from("option")
        .insert(optionsToInsert);

      if (optionError) throw optionError;

      alert(`✅ Encuesta "${title}" creada correctamente`);
      resetForm();
    } catch (err: any) {
      console.error("Error al crear encuesta:", err.message);
      alert("❌ Error al crear la encuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <View style={styles.form}>
          <Text variant="headlineMedium" style={styles.title}>
            Crear Encuesta
          </Text>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              error={errors.titleEmpty}
              style={styles.input}
              mode="outlined"
            />
            {errors.titleEmpty && (
              <HelperText type="error" visible>
                Introduzca el título de la encuesta
              </HelperText>
            )}
          </View>

          <View style={{ marginBottom: 12 }}>
            <TextInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              error={errors.descriptionEmpty}
              multiline
              style={styles.input}
              mode="outlined"
            />
            {errors.descriptionEmpty && (
              <HelperText type="error" visible>
                Introduzca la descripción de la encuesta
              </HelperText>
            )}
          </View>

          <OptionsForm
            options={options}
            setOptions={setOptions}
            error={errors.optionsEmpty}
          />

          <Text variant="headlineSmall" style={styles.text}>
            Programar encuesta
          </Text>

          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <DateTimePicker
                label="Fecha Inicio"
                value={startTime}
                setValue={setStartTime}
                error={errors.startEmpty || errors.sameDate}
                disablePastDates
                stylesInput={styles.inputHalf}
              />
              <DateTimePicker
                label="Fecha Fin"
                value={endTime}
                error={errors.endEmpty || errors.sameDate || errors.endBeforeStart}
                setValue={setEndTime}
                disablePastDates
                stylesInput={styles.inputHalf}
              />
            </View>

            {errors.startEmpty && (
              <HelperText type="error" visible>
                Introduzca la fecha inicio de la encuesta
              </HelperText>
            )}
            {errors.endEmpty && (
              <HelperText type="error" visible>
                Introduzca la fecha fin de la encuesta
              </HelperText>
            )}
            {errors.sameDate && (
              <HelperText type="error" visible>
                La fecha inicio y la fecha fin no pueden ser la misma
              </HelperText>
            )}
            {errors.endBeforeStart && (
              <HelperText type="error" visible>
                La fecha fin no puede ser antes que la fecha inicio
              </HelperText>
            )}
          </View>

          <NotificationSwitch value={notify} setValue={setNotify} />

          <Divider style={styles.button} />

          <Button
            mode="contained"
            style={styles.button}
            loading={loading}
            disabled={loading}
            onPress={() => setSubmitVisible(true)}
          >
            Crear y publicar encuesta
          </Button>

          <Button
            mode="outlined"
            style={styles.button}
            disabled={loading}
            onPress={() => setResetVisible(true)}
          >
            Restablecer formulario
          </Button>
        </View>

        {/* Modal reset */}
        <AppModal
          visible={resetVisible}
          dismissable={false}
          onDismiss={() => setResetVisible(false)}
        >
          <Text variant="headlineMedium" style={styles.title}>
            Restablecer formulario
          </Text>
          <Text style={styles.text}>
            ¿Estás seguro que quieres resetear el formulario? {"\n"}
            Toda la información se perderá.
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              mode="elevated"
              onPress={() => setResetVisible(false)}
              style={styles.inputHalf}
            >
              Cancelar
            </Button>
            <Button mode="contained" onPress={resetForm} style={styles.inputHalf}>
              Restablecer
            </Button>
          </View>
        </AppModal>

        {/* Modal publicar */}
        <AppModal
          visible={submitVisible}
          dismissable={false}
          onDismiss={() => setSubmitVisible(false)}
        >
          <Text variant="headlineMedium" style={styles.title}>
            Publicar encuesta
          </Text>
          <Text style={styles.text}>
            ¿Estás seguro que quieres publicar la encuesta?
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              mode="elevated"
              onPress={() => setSubmitVisible(false)}
              style={styles.inputHalf}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit(); // Primero ejecuta tu función
                navigation.navigate("Home"); // Luego navega
              }}
              style={styles.inputHalf}
            >
              Publicar
            </Button>
          </View>
        </AppModal>
      </ScrollView>
    </GradientBackground>
  );
};

export default CreatePollScreen;

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
  input: {
    width: "100%",
  },
  inputHalf: {
    width: "48%",
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
});
