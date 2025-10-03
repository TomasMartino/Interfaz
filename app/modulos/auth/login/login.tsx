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

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usernameHasError, setUsernameHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);

  const handleLogin = () => {
    setIsProcessing(true);
    if (!username) {
      setUsernameHasError(true);
    }

    if (!password) {
      setPasswordHasError(true);
    }

    if (!username || !password) {
      setIsProcessing(false);
      return;
    }

    setUsernameHasError(false);
    setPasswordHasError(false);
    // Aquí conectas con tu backend
    alert(`Login con correo: ${username}`);
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
        error={usernameHasError}
        style={{
          width: "80%",
        }}
      />
      <HelperText type="error" visible={usernameHasError}>
        Introduzca su nombre de usuario
      </HelperText>
      <TextInput
        label="Contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={password}
        secureTextEntry={!showPassword}
        error={passwordHasError}
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
      <HelperText type="error" visible={passwordHasError}>
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
        Crea una cuenta
      </Button>
    </View>
  );
};

export default LoginScreen;