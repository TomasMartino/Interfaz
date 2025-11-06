import React, { useEffect, useRef, useState } from "react";
import { chartColors } from "./colors";
import { pollStart, voteStart } from "./data";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import {
  Divider,
  IconButton,
  ProgressBar,
  SegmentedButtons,
  Surface,
  Text,
} from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import BarChart from "./components/barChart";
import PieChart from "./components/pieChart";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PollResults"
>;

export type poll = {
  id: number;
  title: string;
  TotalVotes: number;
};

export type vote = {
  id: number;
  optionName: string;
  optionOrder: number;
  percentageVotes: number;
  numVotes: number;
};

const PollResultsScreen = () => {
  const [poll, setPoll] = useState<poll>(pollStart);
  const [votes, setVotes] = useState<vote[]>(voteStart);
  const [chart, setChart] = useState("bar");
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [chart]);

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      <View style={styles.form}>
        <Text variant="displayMedium" style={styles.title}>
          {poll.title}
        </Text>
        <SegmentedButtons
          style={styles.text}
          value={chart}
          onValueChange={setChart}
          buttons={[
            {
              value: "bar",
              label: "Gráfico Barras",
            },
            {
              value: "percentage",
              label: "Gráfico Porcentajes",
            },
          ]}
        />
        <Animated.View style={[{ opacity }]}>
          {chart == "bar" ? (
            <BarChart votes={votes} poll={poll} />
          ) : (
            <PieChart votes={votes} poll={poll} />
          )}
        </Animated.View>
        <Divider style={styles.text} />
        <View style={styles.text}>
          {votes.map((v, i) => {
            return (
              <Surface
                key={v.id}
                style={[
                  styles.surface,
                  styles.textSuface,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    icon="circle-outline"
                    containerColor={chartColors[i]}
                  />
                  <Text variant="titleMedium">
                    {v.optionName + "\n"}
                    {v.numVotes} Votos
                  </Text>
                </View>
                <Text variant="titleMedium">{v.percentageVotes}%</Text>
              </Surface>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default PollResultsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  form: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  title: {
    marginTop: 16,
    marginBottom: 16,
  },
  text: {
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
  surface: {
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 20,
    paddingLeft: 22,
  },
  textSuface: {
    padding: 12,
    paddingLeft: 6,
    flexDirection: "row",
    alignItems: "center",
  },
});
