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

  const handleRegister = async () => {
    setIsProcessing(true);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }

    try {
      // Crear usuario en Supabase Auth
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

      // Guardar datos del usuario en la tabla "users"
      if (user) {
        const { error: insertError } = await supabase.from("Users").insert([
          {
            id: user.id,
            name: username,
            email,
            registration_date: new Date(),
            active: false,
          },
        ]);

        if (insertError) {
          alert("Error al guardar en la base de datos: " + insertError.message);
          setIsProcessing(false);
          return;
        }
      }

      alert("✅ Cuenta creada. Revisa tu correo para verificarla.");
      navigation.navigate("Login");
    } catch (err: any) {
      alert("Error de conexión: " + (err.message ?? err));
    } finally {
      setIsProcessing(false);
    }
  };

  const checkErrors = (): boolean => {
    let newErrors = { ...startErrors };

    // Validación Email
    if (!email) newErrors.emailEmpty = true;
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.notEmail = true;

    // Validación Username
    if (!username) newErrors.usernameEmpty = true;
    else {
      if (/[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(username)) newErrors.usernameInvalid = true;
      if (username.length >= 25) newErrors.usernameMax = true;
      if (username.length <= 4) newErrors.usernameMin = true;
    }

    // Validación Password
    if (!password) newErrors.passwordEmpty = true;
    else {
      if (password.length >= 32) newErrors.passwordMax = true;
      if (password.length <= 8) newErrors.passwordMin = true;
      if (!/^(?=.*[A-Z])(?=.*\d).+$/.test(password)) newErrors.passwordInvalid = true;
      if (password !== repeatPassword) newErrors.passwordFailed = true;
    }

    setErrors(newErrors);
    return Object.values(newErrors).includes(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="displayMedium" style={{ marginBottom: 16 }}>
        Crear una cuenta
      </Text>

      {/* Nombre de Usuario */}
      <TextInput
        label="Nombre de Usuario"
        mode="outlined"
        placeholder="Nombre"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        error={errors.usernameEmpty || errors.usernameInvalid || errors.usernameMax || errors.usernameMin}
        style={{ width: "80%" }}
      />
      <HelperText type="error" visible={errors.usernameEmpty}>
        Introduzca su nombre de usuario
      </HelperText>
      <HelperText type="error" visible={errors.usernameInvalid}>
        El nombre de usuario no puede tener caracteres especiales
      </HelperText>
      <HelperText type="error" visible={errors.usernameMax}>
        El nombre de usuario es demasiado largo
      </HelperText>
      <HelperText type="error" visible={errors.usernameMin}>
        El nombre de usuario debe ser más largo
      </HelperText>

      {/* Email */}
      <TextInput
        label="Email"
        mode="outlined"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        error={errors.emailEmpty || errors.notEmail}
        style={{ width: "80%" }}
      />
      <HelperText type="error" visible={errors.emailEmpty}>
        Introduzca su dirección de email
      </HelperText>
      <HelperText type="error" visible={errors.notEmail}>
        No es un email válido
      </HelperText>

      {/* Contraseña */}
      <TextInput
        label="Contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={setPassword}
        autoCapitalize="none"
        error={errors.passwordEmpty || errors.passwordFailed || errors.passwordInvalid || errors.passwordMax || errors.passwordMin}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={{ width: "80%" }}
      />
      <HelperText type="error" visible={errors.passwordEmpty}>
        Introduzca su contraseña
      </HelperText>
      <HelperText type="error" visible={errors.passwordMin}>
        La contraseña debe ser más larga
      </HelperText>
      <HelperText type="error" visible={errors.passwordMax}>
        La contraseña es demasiado larga
      </HelperText>
      <HelperText type="error" visible={errors.passwordInvalid}>
        La contraseña necesita un número y una letra mayúscula
      </HelperText>

      {/* Repetir contraseña */}
      <TextInput
        label="Repita la contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={repeatPassword}
        secureTextEntry={!showPassword}
        onChangeText={setRepeatPassword}
        autoCapitalize="none"
        error={errors.passwordEmpty || errors.passwordFailed}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye" : "eye-off"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={{ width: "80%" }}
      />
      <HelperText type="error" visible={errors.passwordFailed}>
        La contraseña no coincide
      </HelperText>

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
  );
};

export default RegisterScreen;
