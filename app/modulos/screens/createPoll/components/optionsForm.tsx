import React, { useState } from "react";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { option } from "../createPoll";
import { StyleProp, StyleSheet, TextStyle } from "react-native";

type props = {
  options: option[];
  setOptions: React.Dispatch<React.SetStateAction<option[]>>;
  error: boolean | undefined;
};

const optionsForm = ({
  options,
  setOptions,
  error = false,
}: props) => {
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
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], optionText: text };
      return copy;
    });
  };

  const deleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  return (
    <>
      <Text variant="headlineSmall" style={styles.text}>
        Opciones
      </Text>
      {options.map((v, i, { length }) => {
        return (
          <TextInput
            key={i}
            value={v.optionText}
            mode="outlined"
            placeholder={`Opción ${i + 1}`}
            error={error}
            onChangeText={(o) => editOption(i, o)}
            right={
              i > 1 ? (
                <TextInput.Icon
                  icon="delete-outline"
                  onPress={() => deleteOption(i)}
                />
              ) : null
            }
            style={i + 1 !== length ? styles.input : styles.inputLast}
          />
        );
      })}
      <HelperText type="error" visible={error}>
        Una de las opciones esta vacia
      </HelperText>
      <Button
        mode="elevated"
        icon="plus-circle-outline"
        disabled={isAdding}
        onPress={addOption}
        style={styles.input}
      >
        Añadir más opciones
      </Button>
    </>
  );
};

export default optionsForm;

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
