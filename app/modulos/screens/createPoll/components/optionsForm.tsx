import React, { useState } from "react";
import { Text, TextInput, Button } from "react-native-paper";
import { option } from "../createPoll";
import { StyleProp, TextStyle } from "react-native";

type props = {
  options: option[];
  setOptions: React.Dispatch<React.SetStateAction<option[]>>;
  stylesText: StyleProp<TextStyle>;
  stylesInput: StyleProp<TextStyle>;
};

const optionsForm = ({
  options,
  setOptions,
  stylesText,
  stylesInput,
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
      <Text variant="headlineSmall" style={stylesText}>
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
            right={
              i > 1 ? (
                <TextInput.Icon
                  icon="delete-outline"
                  onPress={() => deleteOption(i)}
                />
              ) : null
            }
            style={stylesInput}
          />
        );
      })}
      <Button
        mode="elevated"
        icon="plus-circle-outline"
        disabled={isAdding}
        onPress={addOption}
        style={stylesInput}
      >
        Añadir más opciones
      </Button>
    </>
  );
};

export default optionsForm;
