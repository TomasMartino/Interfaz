// LoginScreen.js
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native"; // 👈 styled-components (npm install styled-components)
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

type errorsTypes = {
  usernameEmpty: boolean;
  passwordEmpty: boolean;
};

const startErrors: errorsTypes = {
  usernameEmpty: false,
  passwordEmpty: false,
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<errorsTypes>(startErrors);

  const handleLogin = () => {
    setIsProcessing(true);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }
    
    alert(`Login con correo: ${username}`);
    navigation.navigate('Home');
  };

  const checkErrors = (): boolean => {
    let newErrors = { ...startErrors };
    if (!username) {
      newErrors.usernameEmpty = true;
    }

    if (!password) {
      newErrors.passwordEmpty = true;
    }

    const hasErrors = Object.values(newErrors).includes(true);

    setErrors(newErrors);

    return hasErrors;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="displayMedium" style={{ marginBottom: 16 }}>
        Iniciar Sesión
      </Text>
      <TextInput
        label="Nombre de Usuario"
        mode="outlined"
        placeholder="Nombre"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        error={errors.usernameEmpty}
        style={{
          width: "80%",
        }}
      />
      <HelperText type="error" visible={errors.usernameEmpty}>
        Introduzca su nombre de usuario
      </HelperText>
      <TextInput
        label="Contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={password}
        secureTextEntry={!showPassword}
        error={errors.passwordEmpty}
        onChangeText={setPassword}
        autoCapitalize="none"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={{
          width: "80%",
        }}
      ></TextInput>
      <HelperText type="error" visible={errors.passwordEmpty}>
        Introduzca su contraseña
      </HelperText>
      <Button
        mode="contained"
        style={{
          width: "80%",
          marginBottom: 16,
        }}
        onPress={handleLogin}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator animating={true} color="white" />
        ) : (
          "Ingresar"
        )}
      </Button>
      <Button mode="text" onPress={() => navigation.navigate("Register")}>
        ¿No tienes cuenta? Registrate
      </Button>
    </View>
  );
};

export default LoginScreen;
