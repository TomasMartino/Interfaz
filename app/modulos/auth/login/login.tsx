// LoginScreen.js
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native"; // 👈 styled-components (npm install styled-components)
import { Ionicons } from "@expo/vector-icons"; // 👈 librería de iconos (expo install @expo/vector-icons)

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Por favor complete todos los campos.");
      return;
    }
    // Aquí conectas con tu backend
    alert(`Login con correo: ${email}`);
  };

  return (
    <Container>
      <Title>Iniciar Sesión</Title>

      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <PasswordContainer>
        <PasswordInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </PasswordContainer>

      <Button onPress={handleLogin}>
        <ButtonText>Ingresar</ButtonText>
      </Button>
    </Container>
  );
};

export default LoginScreen;

// 🎨 Styled Components
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background-color: #f8f9fa;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 32px;
  color: #333;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0 16px;
  margin-bottom: 20px;
  background-color: #fff;
`;

const PasswordContainer = styled.View`
  width: 100%;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 0 12px;
  margin-bottom: 20px;
  background-color: #fff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PasswordInput = styled.TextInput`
  flex: 1;
  height: 100%;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #007bff;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;
