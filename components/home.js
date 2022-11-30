import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, View } from "react-native";

export const Home = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        title="Add Address"
        onPress={() => {
          navigation.navigate("GoogleSearchFiled");
        }}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
