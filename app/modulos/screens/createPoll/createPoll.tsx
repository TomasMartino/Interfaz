import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Switch,
  Divider,
  useTheme,
} from "react-native-paper";
import { ScrollView, View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "../../Components/datetimepicker/datetimepicker";
import OptionsForm from "./components/optionsForm";

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

const CreatePollScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [options, setOptions] = useState<option[]>(optionsStart);
  const [notify, setNotify] = useState(false);
  const { colors } = useTheme();

  const resetForm = (): void => {
    setTitle("");
    setDescription("");
    setStartTime(null);
    setEndTime(null);
    setOptions(optionsStart);
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
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          style={styles.input}
          mode="outlined"
        />
        <OptionsForm
          options={options}
          setOptions={setOptions}
          stylesText={styles.text}
          stylesInput={styles.input}
        />
        <Text variant="headlineSmall" style={styles.text}>
          Programar encuesta
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <DateTimePicker
            label="Fecha Inicio"
            value={startTime}
            setValue={setStartTime}
            disablePastDates={true}
            stylesInput={styles.inputDate}
          />
          <DateTimePicker
            label="Fecha Fin"
            value={endTime}
            setValue={setEndTime}
            disablePastDates={true}
            stylesInput={styles.inputDate}
          />
        </View>
        <View
          style={{
            marginBottom: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 22,
            paddingLeft: 22,
            backgroundColor: colors.elevation.level1,
          }}
        >
          <Text
            onPress={() => setNotify((n) => !n)}
          >
            Notificar sobre los resultados
          </Text>
          <Switch value={notify} onValueChange={setNotify} />
        </View>
        <Divider style={styles.input} />
        <Button mode="contained" style={styles.input}>
          Crear y publicar encuenta
        </Button>
        <Button mode="outlined" style={styles.input} onPress={resetForm}>
          Restablecer formulario
        </Button>
      </View>
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
    marginBottom: 16,
  },
  inputDate: {
    width: "48%",
    marginBottom: 16,
  },
});
