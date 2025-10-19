import React, { useState } from "react";
import { StyleProp, TextStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";

type props = {
  label: string;
  value: Date | null;
  setValue: (date: Date | null) => void;
  disablePastDates?: boolean;
  stylesInput: StyleProp<TextStyle>;
};

const DateTimePicker = ({
  value,
  label,
  setValue,
  stylesInput,
  disablePastDates = false,
}: props) => {
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  function handleConfirmDate(params: any): void {
    setOpenDate(false);
    setTempDate(params.date);
    setOpenTime(true);
  }

  const handleConfirmTime = (params: {
    hours: number;
    minutes: number;
  }): void => {
    setOpenTime(false);
    if (tempDate) {
      const newDateTime = new Date(tempDate);
      newDateTime.setHours(params.hours);
      newDateTime.setMinutes(params.minutes);
      setValue(newDateTime);
    }
  };

  const validRange = disablePastDates
    ? {
        startDate: (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return today;
        })(),
      }
    : undefined;

  return (
    <>
      <TextInput
        label={label}
        placeholder="DD/MM/YYYY hh:mm"
        style={stylesInput}
        value={
          value
            ? `${value.toLocaleDateString("es")} ${value.toLocaleTimeString(
                "es",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}`
            : ""
        }
        editable={false}
        mode="outlined"
        right={
          <TextInput.Icon
            icon="calendar-clock"
            onPress={() => setOpenDate(true)}
          />
        }
      />

      <DatePickerModal
        locale="es"
        mode="single"
        visible={openDate}
        onDismiss={() => setOpenDate(false)}
        date={value || new Date()}
        onConfirm={handleConfirmDate}
        validRange={validRange}
      />

      <TimePickerModal
        locale="es"
        visible={openTime}
        onDismiss={() => setOpenTime(false)}
        onConfirm={handleConfirmTime}
        hours={value ? value.getHours() : new Date().getHours()}
        minutes={value ? value.getMinutes() : new Date().getMinutes()}
      />
    </>
  );
};

export default DateTimePicker;
