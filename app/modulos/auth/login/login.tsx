import React, { useState } from "react";
import { View, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { supabase } from "../../../../backend/server/supabase";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

type Errors = {
  usernameEmpty: boolean;
  passwordEmpty: boolean;
  credentialsFailed: boolean;
};

const initialErrors: Errors = {
  usernameEmpty: false,
  passwordEmpty: false,
  credentialsFailed: false,
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Errors>(initialErrors);

  const handleLogin = async () => {
    setIsProcessing(true);
    setErrors(initialErrors);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }

    try {
      let emailToUse = usernameOrEmail;

      // Si no es un email, buscamos el email asociado al username
      if (!/\S+@\S+\.\S+/.test(usernameOrEmail)) {
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("email, active")
          .eq("username", usernameOrEmail)
          .maybeSingle();

        if (userError || !userData) {
          setErrors({ ...initialErrors, credentialsFailed: true });
          setIsProcessing(false);
          return;
        }

        if (!userData.active) {
          Alert.alert(
            "Cuenta inactiva",
            "Tu cuenta no está activa. Verifica tu correo antes de iniciar sesión."
          );
          setIsProcessing(false);
          return;
        }

        emailToUse = userData.email;
      }

      // Intentar login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error || !data.user) {
        if (error?.message?.includes("Email not confirmed")) {
          Alert.alert(
            "Correo no verificado",
            "Por favor, verifica tu correo electrónico antes de iniciar sesión."
          );
        } else {
          setErrors({ ...initialErrors, credentialsFailed: true });
        }
        setIsProcessing(false);
        return;
      }

      // Si llega acá, todo bien
      Alert.alert("✅ Sesión iniciada correctamente");
      navigation.navigate("Home");
    } catch (err: any) {
      Alert.alert("Error de conexión", err.message ?? String(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const checkErrors = (): boolean => {
    const newErrors = { ...initialErrors };

    if (!usernameOrEmail) newErrors.usernameEmpty = true;
    if (!password) newErrors.passwordEmpty = true;

    setErrors(newErrors);
    return Object.values(newErrors).includes(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="displayMedium" style={{ marginBottom: 16 }}>
        Iniciar Sesión
      </Text>

      <TextInput
        label="Usuario o Email"
        mode="outlined"
        placeholder="Ingresa tu nombre de usuario o email"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
        autoCapitalize="none"
        error={errors.usernameEmpty || errors.credentialsFailed}
        style={{ width: "80%" }}
      />
      <HelperText type="error" visible={errors.usernameEmpty}>
        Introduzca su usuario o email
      </HelperText>

      <TextInput
        label="Contraseña"
        mode="outlined"
        placeholder="Contraseña"
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={setPassword}
        autoCapitalize="none"
        error={errors.passwordEmpty || errors.credentialsFailed}
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
      <HelperText type="error" visible={errors.credentialsFailed}>
        Credenciales incorrectas o cuenta no verificada
      </HelperText>

      <Button
        mode="contained"
        style={{ width: "80%", marginBottom: 16 }}
        onPress={handleLogin}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator animating color="white" />
        ) : (
          "Ingresar"
        )}
      </Button>

      <Button mode="text" onPress={() => navigation.navigate("Register")}>
        ¿No tienes cuenta? Regístrate
      </Button>
    </View>
  );
};

export default LoginScreen;
