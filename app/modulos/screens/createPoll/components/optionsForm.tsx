import React from "react";
import { StyleSheet } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";

type Option = {
  optionText: string;
};

type Props = {
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  error?: boolean;
};

const OptionsForm: React.FC<Props> = ({ options, setOptions, error = false }) => {
  const addOption = () => {
    setOptions((prev) => [...prev, { optionText: "" }]);
  };

  const editOption = (index: number, text: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { optionText: text };
      return updated;
    });
  };

  const deleteOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Text variant="headlineSmall" style={styles.text}>
        Opciones
      </Text>

      {options.map((option, i) => (
        <TextInput
          key={i}
          value={option.optionText}
          mode="outlined"
          placeholder={`Opción ${i + 1}`}
          error={error}
          onChangeText={(text) => editOption(i, text)}
          right={
            i > 1 ? (
              <TextInput.Icon
                icon="delete-outline"
                onPress={() => deleteOption(i)}
              />
            ) : undefined
          }
          style={i < options.length - 1 ? styles.input : styles.inputLast}
        />
      ))}

      <HelperText type="error" visible={error}>
        Una de las opciones está vacía
      </HelperText>

      <Button
        mode="elevated"
        icon="plus-circle-outline"
        onPress={addOption}
        style={styles.input}
      >
        Añadir más opciones
      </Button>
    </>
  );
};

export default OptionsForm;

const styles = StyleSheet.create({
  text: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  inputLast: {
    width: "100%",
  },
});
