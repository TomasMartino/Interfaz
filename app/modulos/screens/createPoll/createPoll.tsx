import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Switch,
} from "react-native-paper";
import { ScrollView, View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CreatePoll"
>;

type option = {
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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [options, setOptions] = useState<option[]>(optionsStart);
  const [isAdding, setIsAdding] = useState(false);

  const addOption = () => {
    setIsAdding(true);

    const newOption = {
      optionText: "",
    };

    setOptions((op) => [...op, newOption]);

    setIsAdding(false);
  };

  const editOption = (index: number, text: string) => {
    const updatedOptions = options.map((v, i) => {
      i == index ? (v.optionText = text) : null;
      return v;
    });
    setOptions(updatedOptions);
  };

  const deleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
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
        <Text variant="headlineSmall" style={styles.text}>
          Opciones
        </Text>
        {options.map((v, i) => {
          return (
            <TextInput
              key={i}
              value={v.optionText}
              mode="outlined"
              placeholder={`Opción ${i + 1}`}
              onChangeText={(o) => editOption(i, o)}
              right={i > 1 ? 
              <TextInput.Icon icon="delete-outline" onPress={() => deleteOption(i)}/> 
              : null}
              style={styles.input}
            />
          );
        })}
        <Button
          mode="elevated"
          icon="plus-circle-outline"
          disabled={isAdding}
          onPress={addOption}
          style={styles.input}
        >
          Añadir más opciones
        </Button>
        <Text variant="headlineSmall" style={styles.text}>
          Programar encuesta
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TextInput
            label="Fecha inicio"
            value={startTime ? startTime.toLocaleString() : ""}
            mode="outlined"
            style={styles.inputDate}
          />
          <TextInput
            label="Fecha fin"
            value={endTime ? endTime.toLocaleString() : ""}
            mode="outlined"
            style={styles.inputDate}
          />
        </View>
        <Button mode="contained">Crear y publicar encuenta</Button>
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
    width: "45%",
    marginBottom: 16,
  },
});
