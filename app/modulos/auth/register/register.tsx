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

  const handleLogin = () => {
    setIsProcessing(true);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }

    alert(`Creaste una cuenta con el correo: ${email}`);
  };

  const checkErrors = () : boolean => {
    let newErrors = { ...startErrors };
    if (!email) {
      newErrors.emailEmpty = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.notEmail = true;
    }
    if (!username) {
      newErrors.usernameEmpty = true;
    } else {
      if (/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(username)) {
        newErrors.usernameInvalid = true;
      }
      if (username.length >= 25) {
        newErrors.usernameMax = true;
      }
      if (username.length <= 4) {
        newErrors.usernameMin = true;
      }
    }
    if (!password) {
      newErrors.passwordEmpty = true;
    } else {
      if (password.length >= 32) {
        newErrors.passwordMax = true;
      }
      if (password.length <= 8) {
        newErrors.passwordMin = true;
      }
      if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
        newErrors.passwordInvalid = true;
      }
      if (password != repeatPassword) {
        newErrors.passwordFailed = true;
      }
    }

    const hasErrors = Object.values(newErrors).includes(true);

    setErrors(newErrors);

    return hasErrors;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="displayMedium" style={{ marginBottom: 16 }}>
        Crear una cuenta
      </Text>
      <TextInput
        label="Nombre de Usuario"
        mode="outlined"
        placeholder="Nombre"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        error={
          errors.usernameEmpty ||
          errors.passwordInvalid ||
          errors.usernameMax ||
          errors.usernameMin
        }
        style={{
          width: "80%",
        }}
      />
      {errors.usernameEmpty && (
        <HelperText type="error" visible>
          Introduzca su nombre de usuario
        </HelperText>
      )}
      {errors.usernameInvalid && (
        <HelperText type="error" visible>
          El nombre de usuario no puede contener caracteres especiales
        </HelperText>
      )}
      {errors.usernameMax && (
        <HelperText type="error" visible>
          El nombre de usuario es demasiado largo
        </HelperText>
      )}
      {errors.usernameMin && (
        <HelperText type="error" visible>
          El nombre de usuario debe ser más largo
        </HelperText>
      )}
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
      {errors.emailEmpty && (
        <HelperText type="error" visible>
          Introduzca su dirección de email
        </HelperText>
      )}
      {errors.notEmail && (
        <HelperText type="error" visible>
          No es un email
        </HelperText>
      )}
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
      {errors.passwordEmpty && (
        <HelperText type="error" visible>
          Introduzca su contraseña
        </HelperText>
      )}
      {errors.passwordMax && (
        <HelperText type="error" visible>
          La contraseña es demasiado larga
        </HelperText>
      )}
      {errors.passwordMin && (
        <HelperText type="error" visible>
          La contraseña debe ser más larga
        </HelperText>
      )}
      {errors.passwordInvalid && (
        <HelperText type="error" visible>
          La contraseña necesita un número y una letra en mayúscula
        </HelperText>
      )}
      <TextInput
        label="Repita la contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={repeatPassword}
        secureTextEntry={!showPassword}
        error={errors.passwordEmpty || errors.passwordFailed}
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
      <HelperText
        type="error"
        visible={errors.passwordEmpty || errors.passwordFailed}
      >
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
        ¿Tienes una cuenta? Inicia Sesión
      </Button>
    </View>
  );
};

export default RegisterScreen;
