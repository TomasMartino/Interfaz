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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;
type errorsTypes = {
  notEmail: boolean;
  emailEmpty: boolean;
  usernameMax: boolean;
  usernameMin: boolean;
  usernameEmpty: boolean;
  passwordMin: boolean;
  passwordMax: boolean;
  passwordInvalid: boolean;
  passwordEmpty: boolean;
  passwordFailed: boolean;
};

const startErrors = {
  notEmail: false,
  emailEmpty: false,
  usernameMax: false,
  usernameMin: false,
  usernameEmpty: false,
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

  const handleLogin = () => {
    setIsProcessing(true);

    if (validateForm()) {
      setIsProcessing(false);
      return;
    }

    alert(`Creaste una cuenta con el correo: ${email}`);
  };

  const validateForm = () => {
    let newErrors = {...startErrors};
    if (!email) {
      newErrors.emailEmpty = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.notEmail = true;
    }
    if (!username) {
      newErrors.usernameEmpty = true;
    } else {
      if (username.length < 26) {
        newErrors.usernameMin = true;
      }
      if (username.length < 5) {
        newErrors.usernameMax = true;
      }
    }
    if (!password) {
      newErrors.passwordEmpty = true;
    } else {
      if (password.length < 33) {
        newErrors.passwordMax = true;
      }
      if (password.length < 8) {
        newErrors.passwordMin = true;
      }
      if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
        newErrors.passwordInvalid = true;
      }
      if (password != repeatPassword) {
        newErrors.passwordFailed = true;
      }
    }

    if (!password && password == repeatPassword) {
        newErrors.passwordFailed = true;
      }

    const invalid = Object.values(newErrors).includes(true);

    setErrors(newErrors);

    return invalid;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="displayMedium" style={{ marginBottom: 16 }}>
        Crear una cuenta
      </Text>
      <TextInput
        label="Email"
        mode="outlined"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        error={errors.emailEmpty || errors.notEmail}
        style={{
          width: "80%",
        }}
      />
      <HelperText type="error" visible={errors.emailEmpty || errors.notEmail}>
        {errors.emailEmpty && 'El email esta vacio'}
        {errors.notEmail && 'No es un email'}
      </HelperText>
      <TextInput
        label="Nombre de Usuario"
        mode="outlined"
        placeholder="Nombre"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        error={errors.usernameEmpty || errors.usernameMax || errors.usernameMin}
        style={{
          width: "80%",
        }}
      />
      <HelperText type="error" visible={errors.usernameEmpty || errors.usernameMax || errors.usernameMin}>
        {errors.usernameEmpty && "Introduzca su nombre de usuario"}
        {errors.usernameMax && "El nombre de usuario es demasiado largo \n"}
        {errors.usernameMin && "El nombre de usuario debe ser más largo \n"}
      </HelperText>
      <TextInput
        label="Contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={password}
        secureTextEntry={!showPassword}
        error={
          errors.passwordEmpty ||
          errors.passwordFailed ||
          errors.passwordInvalid ||
          errors.passwordMax ||
          errors.passwordMin
        }
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
      <HelperText
        type="error"
        visible={
          errors.passwordEmpty ||
          errors.passwordInvalid ||
          errors.passwordMax ||
          errors.passwordMin
        }
      >
        {errors.passwordEmpty && "Introduzca su contraseña"}
        {errors.passwordMax && "La contraseña es demasiado larga \n"}
        {errors.passwordMin && "La contraseña debe ser más larga \n"}
        {errors.passwordInvalid &&
          "La contraseña necesita un numero y una letra en mayuscula"}
      </HelperText>
      <TextInput
        label="Repita la contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={repeatPassword}
        secureTextEntry={!showPassword}
        error={errors.passwordFailed}
        onChangeText={setRepeatPassword}
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
      <HelperText type="error" visible={errors.passwordFailed}>
        La contraseña no es la misma
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
      <Button mode="text" onPress={() => navigation.navigate("Login")}>
        Inicia Sesión
      </Button>
    </View>
  );
};

export default RegisterScreen;
