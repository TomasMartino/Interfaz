import React, { ReactElement } from "react";
import { View } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";

type Props = {
  children: ReactElement[];
  visible: boolean;
  dismissable: boolean;
  onDismiss: () => void;
};

const AppModal = ({
  children,
  visible,
  dismissable = false,
  onDismiss,
}: Props) => {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={dismissable}
        onDismiss={onDismiss}
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: 20
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: colors.background,
            padding: 25,
            borderRadius: 15
          }}
        >
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default AppModal;
