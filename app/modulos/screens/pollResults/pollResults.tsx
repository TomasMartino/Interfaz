import React, { useEffect, useState, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import {
  Divider,
  IconButton,
  Surface,
  Text,
  SegmentedButtons,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import GradientBackground from "../../Components/gradientBackground/gradientBackground";
import BarChart from "./components/barChart";
import PieChart from "./components/pieChart";
import { supabase } from "../../../../backend/server/supabase";
import { chartColors } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "PollResults">;

export type Poll = {
  id: number;
  title: string;
  totalVotes: number;
};

export type Vote = {
  id: number;
  optionName: string;
  optionOrder: number;
  numVotes: number;
  percentageVotes: number;
};

const PollResultsScreen = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [chart, setChart] = useState("bar");
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 0, duration: 1, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [chart]);

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const storedPollId = await AsyncStorage.getItem("selectedPollId");
        if (!storedPollId) return console.warn("No se encontró ID de la encuesta");
        const pollId = parseInt(storedPollId, 10);

        // 🔹 Traer datos de la encuesta
        const { data: pollData, error: pollError } = await supabase
          .from("poll")
          .select("*")
          .eq("id", pollId)
          .maybeSingle();
        if (pollError || !pollData) throw new Error(pollError?.message);

        setPoll({ id: pollData.id, title: pollData.title, totalVotes: 0 });

        // 🔹 Traer opciones de la encuesta
        const { data: optionsData, error: optionsError } = await supabase
          .from("option")
          .select("*")
          .eq("poll_id", pollId)
          .order("option_order", { ascending: true });
        if (optionsError) throw new Error(optionsError.message);

        // 🔹 Contar votos por opción desde la tabla vote
        const { data: votesData, error: votesError } = await supabase
          .from("vote")
          .select("id, option_id")
          .eq("poll_id", pollId);
        if (votesError) throw new Error(votesError.message);

        const votesCountMap: Record<number, number> = {};
        votesData?.forEach(v => {
          votesCountMap[v.option_id] = (votesCountMap[v.option_id] || 0) + 1;
        });

        const totalVotes = votesData?.length || 0;

        const votesProcessed: Vote[] = optionsData.map(opt => {
          const numVotes = votesCountMap[opt.id] || 0;
          return {
            id: opt.id,
            optionName: opt.option_text,
            optionOrder: opt.option_order,
            numVotes,
            percentageVotes: totalVotes > 0 ? Math.round((numVotes / totalVotes) * 100) : 0,
          };
        });

        setVotes(votesProcessed);
        setPoll(prev => prev ? { ...prev, totalVotes } : null);
      } catch (err) {
        console.error("Error obteniendo resultados:", err);
      }
    };

    fetchPollResults();
  }, []);

  if (!poll) return <Text>Cargando resultados...</Text>;

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <View style={styles.form}>
          <Text variant="displayMedium" style={styles.title}>{poll.title}</Text>
          <SegmentedButtons
            style={styles.text}
            value={chart}
            onValueChange={setChart}
            buttons={[
              { value: "bar", label: "Gráfico Barras" },
              { value: "percentage", label: "Gráfico Porcentajes" },
            ]}
          />
          <Animated.View style={[{ opacity }]}>
            {chart === "bar" ? (
              <BarChart votes={votes} poll={poll} />
            ) : (
              <PieChart votes={votes} poll={poll} />
            )}
          </Animated.View>

          <Divider style={styles.text} />

          <View style={styles.text}>
            {votes.map((v, i) => (
              <Surface
                key={v.id}
                style={[styles.surface, styles.textSuface, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconButton icon="circle-outline" containerColor={chartColors[i]} />
                  <Text variant="titleMedium">
                    {v.optionName + "\n"}
                    {v.numVotes} Votos
                  </Text>
                </View>
                <Text variant="titleMedium">{v.percentageVotes}%</Text>
              </Surface>
            ))}
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

export default PollResultsScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  form: { flex: 1, width: "100%", paddingHorizontal: 16, alignItems: "stretch" },
  title: { marginTop: 16, marginBottom: 16 },
  text: { marginBottom: 16 },
  surface: { justifyContent: "space-between", marginBottom: 16, borderRadius: 20, paddingLeft: 22 },
  textSuface: { padding: 12, paddingLeft: 6, flexDirection: "row", alignItems: "center" },
});
