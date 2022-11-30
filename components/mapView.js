import React from "react";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { googleApiKey } from "../googleApiKey";
import { getFormattedAddress } from "../utils";
import MapMarker from "../assets/MapMarker";

export const GoogleMapView = () => {
  const route = useRoute();
  console.log(route);

  const [address, setAddress] = React.useState(route.params.address);
  const [runInitialMapChange, setRunInitialMapChange] = React.useState(false);
  const [defaultProps, setDefaultProps] = React.useState({
    center: {
      latitude: +route.params.address.latitude || +route.params.address.lat,
      longitude: +route.params.address.longitude || +route.params.address.lng,
    },
    pitch: 1,
    heading: 1,
    altitude: 3,
    zoom: 16,
  });

  const [additionalAddressInfo, setAdditionalAddressInfo] = React.useState({
    line1: "",
    landmark: "",
    label: "",
    notes: "",
  });

  const onChangeMap = (center) => {
    if (!runInitialMapChange) {
      setRunInitialMapChange(true);
      return;
    }
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${center.latitude},${center.longitude}&key=${googleApiKey}&result_type=street_address|point_of_interest&location_type=ROOFTOP`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const formatted_address =
            data.results[0].formatted_address.split(",");
          console.log("infn", data.results[0]);
          const getAddressResult = getFormattedAddress(data.results[0]);
          if (getAddressResult.status) {
            setAddress({
              latitude: center.latitude,
              longitude: center.longitude,
              ...getAddressResult.address,
              searched: "",
            });
          }
        }
      })
      .catch((e) => {
        console.error("error", e);
      });
  };
  console.log("address", address);

  React.useEffect(() => {
    if (address?.line1) {
      setAdditionalAddressInfo((prev) => ({
        ...prev,
        line1: address.line1 || "",
      }));
    }
  }, [address]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={{ position: "relative", flex: 10 }}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          camera={defaultProps}
          onRegionChangeComplete={onChangeMap}
        />
        <View style={styles.mapMarker}>
          <MapMarker />
        </View>
      </View>
      <View style={{ flex: 10 }}>
        {/* <Text>
          currentAddress: {address.line1 || ""} {address.line2 || ""}{" "}
          {address.city || ""} {address.state || ""} {address.country || ""}{" "}
          {address.zipcode || ""}
        </Text> */}
        <ScrollView>
          <AddressForm
            setAdditionalAddressInfo={setAdditionalAddressInfo}
            additionalAddressInfo={additionalAddressInfo}
          />
        </ScrollView>
        <View
          style={{
            padding: 8,
          }}
        >
          <Button
            title="Save Address"
            onPress={() => {
              console.log("address", {
                line1: additionalAddressInfo?.line1 || "",
                line2: address.line2 || "",
                city: address.city,
                state: address.state,
                country: address.country,
                zipcode: address.zipcode,
                notes: additionalAddressInfo?.notes || "",
                label: additionalAddressInfo?.label || "",
                lat: address.latitude.toString(),
                lng: address.longitude.toString(),
                landmark: additionalAddressInfo?.landmark || "",
                searched: "",
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const AddressForm = ({ setAdditionalAddressInfo, additionalAddressInfo }) => {
  const [addressWarnings, setAddressWarnings] = React.useState({
    line1: false,
  });
  const [showOtherLabelField, setShowOtherLabelField] = React.useState(false);
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <View>
        <Text style={[styles.formLabel]}>
          Apartment/Building Info/Street info*
        </Text>
        {addressWarnings.line1 ? (
          <Text style={[styles.formLabel, { color: "red" }]}>
            fill this field
          </Text>
        ) : null}
        <TextInput
          style={[styles.inputField]}
          placeholder="Enter apartment/building info/street info"
          value={additionalAddressInfo.line1}
          onChangeText={(text) => {
            setAdditionalAddressInfo((prev) => ({
              ...prev,
              line1: text,
            }));
            if (text.length === 0) {
              setAddressWarnings((prev) => ({ ...prev, line1: true }));
            }
          }}
        />
      </View>
      <View>
        <Text style={[styles.formLabel, {}]}>Landmark</Text>
        <TextInput
          style={[styles.inputField]}
          placeholder="Enter landmark"
          value={additionalAddressInfo.landmark}
          onChangeText={(text) =>
            setAdditionalAddressInfo((prev) => ({
              ...prev,
              landmark: text,
            }))
          }
        />
      </View>
      <View>
        <Text style={[styles.formLabel, {}]}>Label*</Text>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 8,
          }}
        >
          <Button
            variant="outline"
            buttonStyle={{ marginRight: 13 }}
            onPress={() => {
              setShowOtherLabelField(false);
              setAdditionalAddressInfo((prev) => ({
                ...prev,
                label: "Home",
              }));
            }}
            disabled={additionalAddressInfo.label === "Home"}
            title="Home"
          />

          <Button
            variant="outline"
            buttonStyle={{ marginRight: 13 }}
            onPress={() => {
              setShowOtherLabelField(false);
              setAdditionalAddressInfo((prev) => ({
                ...prev,
                label: "Office",
              }));
            }}
            disabled={additionalAddressInfo.label === "Office"}
            title="Office"
          />

          <Button
            variant="outline"
            buttonStyle={{ marginRight: 13 }}
            onPress={() => {
              setShowOtherLabelField(true);
              setAdditionalAddressInfo((prev) => ({
                ...prev,
                label: "",
              }));
            }}
            disabled={showOtherLabelField}
            title="Other"
          />
        </View>
        {showOtherLabelField ? (
          <TextInput
            style={[styles.inputField]}
            placeholder="Enter label for this address"
            value={additionalAddressInfo.label}
            onChangeText={(text) =>
              setAdditionalAddressInfo((prev) => ({
                ...prev,
                label: text,
              }))
            }
          />
        ) : null}
      </View>
      <View>
        <Text style={[styles.formLabel, {}]}>Dropoff Instructions</Text>
        <TextInput
          style={[styles.inputField]}
          placeholder="Enter dropoff instructions"
          value={additionalAddressInfo.notes}
          onChangeText={(text) =>
            setAdditionalAddressInfo((prev) => ({
              ...prev,
              notes: text,
            }))
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    //   width: Dimensions.get('window').width,
    //   height: Dimensions.get('window').height / 2.3,
    flex: 1,
  },
  mapMarker: {
    left: "50%",
    marginLeft: -12,
    marginTop: -48,
    position: "absolute",
    top: "50%",
  },
  refineLocationSelectorHeader: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 12,
  },
  refineLocationText: {
    fontSize: 16,
    lineHeight: 16,
  },
  formLabel: {
    fontSize: 12,
  },
  inputField: {
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    marginVertical: 8,
    elevation: 1,
    shadowColor: "#00000060",
    paddingHorizontal: 12,
  },
});
