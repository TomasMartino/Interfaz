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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

type errorsTypes = {
  usernameEmpty: boolean;
  passwordEmpty: boolean;
  credentialsFailed: boolean;
};

const startErrors: errorsTypes = {
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
  const [errors, setErrors] = useState<errorsTypes>(startErrors);

  const handleLogin = async () => {
    setIsProcessing(true);
    setErrors(startErrors);

    if (checkErrors()) {
      setIsProcessing(false);
      return;
    }


    try {
      let emailToUse = usernameOrEmail;

     
      if (!/\S+@\S+\.\S+/.test(usernameOrEmail)) {
        const { data: userData, error: userError } = await supabase
          .from("Users")
          .select("email, active")
          .eq("username", usernameOrEmail)
          .single();

        if (userError || !userData) {
          setErrors({ ...startErrors, credentialsFailed: true });
          setIsProcessing(false);
          return;
        }

        if (!userData.active) {
          alert("Tu cuenta no está activa. Verifica tu correo antes de iniciar sesión.");
          setIsProcessing(false);
          return;
        }

        emailToUse = userData.email;
      }

     
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error || !data.user) {
        setErrors({ ...startErrors, credentialsFailed: true });
        setIsProcessing(false);
        return;
      }

      alert("✅ Sesión iniciada correctamente");
      navigation.navigate("Home");
    } catch (err: any) {
      alert("Error de conexión: " + (err.message ?? err));
    } finally {
      setIsProcessing(false);
    }

  };

  const checkErrors = (): boolean => {
    let newErrors = { ...startErrors };

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
