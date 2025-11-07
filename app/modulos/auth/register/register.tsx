import React, { useState } from "react";
import { View } from "react-native";
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
import { supabase } from "../../../../backend/server/supabase";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

type errorsTypes = {
  notEmail: boolean;
  emailEmpty: boolean;
  usernameMax: boolean;
  usernameMin: boolean;
  usernameEmpty: boolean;
  usernameInvalid: boolean;
  passwordMin: boolean;
  passwordMax: boolean;
  passwordInvalid: boolean;
  passwordEmpty: boolean;
  passwordFailed: boolean;
};

const startErrors: errorsTypes = {
  notEmail: false,
  emailEmpty: false,
  usernameMax: false,
  usernameMin: false,
  usernameEmpty: false,
  usernameInvalid: false,
  passwordMin: false,
  passwordMax: false,
  passwordInvalid: false,
  passwordEmpty: false,
  passwordFailed: false,
};

const RegisterScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<errorsTypes>(startErrors);

  const checkErrors = (): boolean => {
    let newErrors = { ...startErrors };

    // 🔹 Email
    if (!email) newErrors.emailEmpty = true;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.notEmail = true;

    // 🔹 Username
    if (!username) newErrors.usernameEmpty = true;
    else {
      if (/[^a-zA-Z0-9_]/.test(username)) newErrors.usernameInvalid = true;
      if (username.length > 25) newErrors.usernameMax = true;
      if (username.length < 4) newErrors.usernameMin = true;
    }

    // 🔹 Password
    if (!password) newErrors.passwordEmpty = true;
    else {
      if (password.length > 32) newErrors.passwordMax = true;
      if (password.length < 8) newErrors.passwordMin = true;
      if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password))
        newErrors.passwordInvalid = true;
      if (password !== repeatPassword) newErrors.passwordFailed = true;
    }

    setErrors(newErrors);
    return Object.values(newErrors).includes(true);
  };

  const handleRegister = async () => {
    setIsProcessing(true);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }

    try {
      // 🔹 Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setIsProcessing(false);
        return;
      }

      const user = data.user;
      if (!user) {
        alert("No se pudo crear el usuario");
        setIsProcessing(false);
        return;
      }

      // 🔹 Guardar datos en AsyncStorage
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("userId", user.id);

      setIsProcessing(false);
      navigation.navigate("Login"); // ir a Login o Home
    } catch (err) {
      console.error("Error registrando usuario:", err);
      alert("Ocurrió un error, intente de nuevo");
      setIsProcessing(false);
    }
  };

  return (
    <GradientBackground>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
          Crear una cuenta
        </Text>

        {/* Nombre de Usuario */}
        <View style={{ width: "80%", marginBottom: 12 }}>
          <TextInput
            label="Nombre de Usuario"
            mode="outlined"
            placeholder="Nombre"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={
              errors.usernameEmpty ||
              errors.usernameInvalid ||
              errors.usernameMax ||
              errors.usernameMin
            }
          />
          {errors.usernameEmpty && <HelperText type="error" visible>Introduzca su nombre de usuario</HelperText>}
          {errors.usernameInvalid && <HelperText type="error" visible>El nombre de usuario no puede tener caracteres especiales</HelperText>}
          {errors.usernameMax && <HelperText type="error" visible>El nombre de usuario es demasiado largo</HelperText>}
          {errors.usernameMin && <HelperText type="error" visible>El nombre de usuario debe ser más largo</HelperText>}
        </View>

        {/* Email */}
        <View style={{ width: "80%", marginBottom: 12 }}>
          <TextInput
            label="Email"
            mode="outlined"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            error={errors.emailEmpty || errors.notEmail}
          />
          {errors.emailEmpty && <HelperText type="error" visible>Introduzca su dirección de email</HelperText>}
          {errors.notEmail && <HelperText type="error" visible>No es un email válido</HelperText>}
        </View>

        {/* Contraseña */}
        <View style={{ width: "80%", marginBottom: 12 }}>
          <TextInput
            label="Contraseña"
            mode="outlined"
            placeholder="Contraseña"
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            autoCapitalize="none"
            error={
              errors.passwordEmpty ||
              errors.passwordFailed ||
              errors.passwordInvalid ||
              errors.passwordMax ||
              errors.passwordMin
            }
            right={<TextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />}
          />
          {errors.passwordEmpty && <HelperText type="error" visible>Introduzca su contraseña</HelperText>}
          {errors.passwordMin && <HelperText type="error" visible>La contraseña debe ser más larga</HelperText>}
          {errors.passwordMax && <HelperText type="error" visible>La contraseña es demasiado larga</HelperText>}
          {errors.passwordInvalid && <HelperText type="error" visible>La contraseña necesita un número y una letra mayúscula</HelperText>}
        </View>

        {/* Repetir contraseña */}
        <View style={{ width: "80%", marginBottom: 24 }}>
          <TextInput
            label="Repita la contraseña"
            mode="outlined"
            placeholder="Contraseña"
            value={repeatPassword}
            secureTextEntry={!showPassword}
            onChangeText={setRepeatPassword}
            autoCapitalize="none"
            error={errors.passwordEmpty || errors.passwordFailed}
            right={<TextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={() => setShowPassword(!showPassword)} />}
          />
          {errors.passwordFailed && <HelperText type="error" visible>La contraseña no coincide</HelperText>}
        </View>

        {/* Botón Registrar */}
        <Button
          mode="contained"
          style={{ width: "80%", marginBottom: 16 }}
          onPress={handleRegister}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator animating color="white" /> : "Registrar"}
        </Button>

        <Button mode="text" onPress={() => navigation.navigate("Login")}>
          ¿Tienes una cuenta? Inicia Sesión
        </Button>
      </View>
    </GradientBackground>
  );
};

export default RegisterScreen;
