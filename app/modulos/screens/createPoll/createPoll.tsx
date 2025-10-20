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

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePoll"
>;

export type option = {
  optionText: string;
};

const optionsStart: option[] = [
  {
    optionText: "",
  },
  {
    optionText: "",
  },
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

  const handleSubmit = (): void => {
    setSubmitVisible(false);
    setLoading(true);

    if (findErrors()) {
      setLoading(false);
      return;
    }

    alert(`Exito al crear ${title}`);
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
      if (endTime.getTime() == startTime.getTime()) foundErrors.sameDate = true;
    }
    foundErrors.optionsEmpty = options.some((o) => o.optionText == "");

    setErrors(foundErrors);

    return Object.values(foundErrors).includes(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      <View style={styles.form}>
        <Text variant="displayMedium" style={styles.title}>
          Crear Encuesta
        </Text>
        <TextInput
          label="Titulo"
          value={title}
          onChangeText={setTitle}
          error={errors.titleEmpty}
          style={styles.input}
          mode="outlined"
        />
        <HelperText type="error" visible={errors.titleEmpty}>
          Introduzca el título de la encuesta
        </HelperText>
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          error={errors.descriptionEmpty}
          multiline={true}
          style={styles.input}
          mode="outlined"
        />
        <HelperText type="error" visible={errors.descriptionEmpty}>
          Introduzca la descripción de la encuesta
        </HelperText>
        <OptionsForm
          options={options}
          setOptions={setOptions}
          error={errors.optionsEmpty}
        />
        <Text variant="headlineSmall" style={styles.text}>
          Programar encuesta
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <DateTimePicker
            label="Fecha Inicio"
            value={startTime}
            setValue={setStartTime}
            error={errors.startEmpty || errors.sameDate}
            disablePastDates={true}
            stylesInput={styles.inputHalf}
          />
          <DateTimePicker
            label="Fecha Fin"
            value={endTime}
            error={errors.endEmpty || errors.sameDate || errors.endBeforeStart}
            setValue={setEndTime}
            disablePastDates={true}
            stylesInput={styles.inputHalf}
          />
        </View>
        <HelperText type="error" visible={errors.startEmpty}>
          Introduzca la fecha inicio de la encuesta
        </HelperText>
        {errors.endEmpty && (
          <HelperText type="error" visible>
            Introduzca la fecha fin de la encuesta
          </HelperText>
        )}
        {errors.sameDate && (
          <HelperText type="error" visible>
            La fecha inicio y la fecha fin no puede ser la misma
          </HelperText>
        )}
        {errors.endBeforeStart && (
          <HelperText type="error" visible>
            La fecha fin no puede ser antes que la fecha inicio
          </HelperText>
        )}
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
      <AppModal
        visible={resetVisible}
        dismissable={false}
        onDismiss={() => setResetVisible(false)}
      >
        <Text variant="headlineMedium" style={styles.title}>Restablecer formulario</Text>
        <Text style={styles.text}>
          ¿Estas seguro que quieres resetear el formulario? {"\n"}
          Toda la información se va a perder.
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
      <AppModal
        visible={submitVisible}
        dismissable={false}
        onDismiss={() => setSubmitVisible(false)}
      >
        <Text variant="headlineMedium" style={styles.title}>Publicar encuesta</Text>
        <Text style={styles.text}>
          ¿Estas seguro que quieres publicar la encuesta?
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            mode="elevated"
            onPress={() => setSubmitVisible(false)}
            style={styles.inputHalf}
          >
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSubmit} style={styles.inputHalf}>
            Publicar
          </Button>
        </View>
      </AppModal>
    </ScrollView>
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
