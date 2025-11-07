import React from "react";
import { Vote, Poll } from "../pollResults";
import PieChart, { Slice } from "react-native-pie-chart";
import { chartColors } from "../colors";
import { View } from "react-native";
import { Text } from "react-native-paper";

type props = {
  votes: Vote[];
  poll: Poll;
};

const pieChart = ({ votes, poll }: props) => {
  console.log(votes)
  const convertSlices = (votes: Vote[]): Slice[] => {
    const series = votes.map((v, i) => {
      return {
        value: v.numVotes,
        color: chartColors[i],
      };
    });
    return series;
  };

  const countVotes = () : number => {
    const sum = votes.reduce((acc, curr) => acc + curr.numVotes, 0)
    return sum;
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {
      countVotes() == 0 ? (
        <PieChart
          widthAndHeight={150}
          series={[
            { value: 1, color: "grey" },
            { value: 1, color: "grey" },
          ]}
          cover={0.3}
        />
      ) : (
        <PieChart
          widthAndHeight={150}
          series={convertSlices(votes)}
          cover={0.3}
          padAngle={0.05}
        />
      )}
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          width: "70%",
        }}
      >
        {votes.map((v, i) => {
          return (
            <View
              key={v.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 4,
                width: "50%",
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: chartColors[i],
                  marginRight: 8,
                }}
              />
              <Text variant="titleSmall">
                {v.optionName} ({v.percentageVotes}%)
              </Text>
            </View>
          );
        })}
        <View
          style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
        >
          <Text variant="titleMedium">Votos Totales: {poll.totalVotes}</Text>
        </View>
      </View>
    </View>
  );
};

export default pieChart;
