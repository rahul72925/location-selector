import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import GPSicon from "../assets/GPSIcon";
import { googleApiKey } from "../googleApiKey";
import { getFormattedAddress } from "../utils";
// import GPSicon from '../../assets/GPSicon'
// import { get_env } from '../../utils/get_env'
// import useGlobalStyle from '../../globalStyle'
import * as Location from "expo-location";

export const GooglePlaceSearchField = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = React.useState("");
  const [locationSearching, setLocationSearching] = React.useState({
    error: false,
    loading: false,
    errorType: "",
  });
  const formatAddress = async (input) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?key=${googleApiKey}&placeid=${input.place_id}&language=en&fields=formatted_address,name,geometry,address_component`
    );
    const data = await response.json();
    console.log(data);
    const { result } = data;
    const userCoordinate = {
      latitude: result.geometry.location.lat.toString(),
      longitude: result.geometry.location.lng.toString(),
    };
    const getAddressResult = getFormattedAddress(result);
    if (getAddressResult.status) {
      const address = {
        ...getAddressResult.address,
        latitude: userCoordinate.latitude,
        longitude: userCoordinate.longitude,
        searched: input.description,
      };
      navigation.navigate("MapView", {
        address: address,
        //   redirect: redirect,
      });
    } else {
      setLocationSearching((prev) => ({
        ...prev,
        loading: false,
        error: true,
        errorType: "zipcodeNotFound",
      }));
    }
  };
  return (
    <View style={{ margin: 8 }}>
      <View>
        <GooglePlacesAutocompleteWrapper
          searchText={searchText}
          setSearchText={setSearchText}
          formatAddress={formatAddress}
          locationSearching={locationSearching}
          setLocationSearching={setLocationSearching}
        />
      </View>
    </View>
  );
};

const GooglePlacesAutocompleteWrapper = ({
  formatAddress = () => {},
  onGPSiconClick,
  showGPSicon = true,
  googleContainerStyle,
  resetTextInput = false,
  searchText,
  setSearchText,
  setLocationSearching,
  locationSearching,
}) => {
  //   const { globalStyle } = useGlobalStyle();
  const navigation = useNavigation();
  const _googleRef = React.useRef();
  const [address, setAddress] = React.useState({});

  React.useEffect(() => {
    if (resetTextInput) {
      _googleRef.current?.setAddressText("");
    }
  }, [resetTextInput]);

  React.useEffect(() => {
    if (searchText?.length) {
      _googleRef.current?.setAddressText(searchText);
      _googleRef.current?.focus();
    }
  }, [searchText]);

  const getLocationFromDevice = async () => {
    setLocationSearching((prev) => ({
      ...prev,
      loading: !prev.loading,
      error: false,
    }));
    let { status } = await Location.requestForegroundPermissionsAsync();
    // let { status: status2 } = await Location.enableNetworkProviderAsync()
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setLocationSearching((prev) => ({
        ...prev,
        loading: !prev.loading,
        error: true,
        errorType: "blockByPermission",
      }));
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
    });

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${googleApiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK" && data.results.length > 0) {
          const formatted_address =
            data.results[0].formatted_address.split(",");
          const mainText = formatted_address
            .slice(0, formatted_address.length - 3)
            .join(",");
          const secondaryText = formatted_address
            .slice(formatted_address.length - 3)
            .join(",");
          const getAddressResult = getFormattedAddress(data.results[0]);
          if (getAddressResult.status) {
            // setIsGetStoresLoading(true);
            setAddress((prev) => ({
              ...getAddressResult.address,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              searched: "",
            }));
            setLocationSearching((prev) => ({
              ...prev,
              loading: false,
              error: false,
              errorType: "",
            }));
            navigation.navigate("MapView", {
              address: {
                ...getAddressResult.address,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                searched: "",
              },
            });
          } else {
            console.log("Error: ", getAddressResult.message);
            setLocationSearching((prev) => ({
              ...prev,
              loading: false,
              error: true,
              errorType: "zipcodeNotFound",
            }));
          }
        }
      })
      .catch((e) => {
        console.log("error", e);
        setLocationSearching((prev) => ({
          ...prev,
          loading: false,
          error: true,
          errorType: "fetchAddress",
        }));
      });
  };
  console.log("address", address);
  return (
    <View
      style={[
        styles.container,
        googleContainerStyle ? googleContainerStyle : {},
      ]}
    >
      <GooglePlacesAutocomplete
        ref={_googleRef}
        placeholder="Search for area, street name..."
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          formatAddress(data);
          // console.log(data, details)
        }}
        minLength={2}
        fetchDetails={true}
        query={{
          key: googleApiKey,
          language: "en",
        }}
        styles={{
          textInput: {
            // fontFamily: globalStyle.font.medium,
            shadowColor: "#000000",
            elevation: 6,
            paddingRight: 35,
            borderRadius: 8,
          },
          listView: {
            // fontFamily: globalStyle.font.medium,
            zIndex: 10000,
            position: "absolute",
            top: 50,
          },
        }}
        onFail={(error) =>
          console.error("Google location search failed: ", error)
        }
        debounce={200}
        textInputProps={{
          onChangeText: (text) => {
            setSearchText(text);
          },
          clearButtonMode: "never",
        }}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          top: 10,
          paddingHorizontal: 10,
        }}
        onPress={() => {
          _googleRef.current?.setAddressText("");
          getLocationFromDevice();
        }}
      >
        <GPSicon />
      </TouchableOpacity>
      <View
        style={{
          marginTop: 50,
        }}
      ></View>
      {locationSearching.loading ? (
        <ActivityIndicator />
      ) : locationSearching.error ? (
        <Text
          style={{
            color: "red",
          }}
        >
          {locationSearching.errorType === "blockByPermission"
            ? "Permission to access location was denied"
            : locationSearching.errorType === "zipcodeNotFound"
            ? "Please select precise location"
            : "Unable to get your location"}
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 50,
    // backgroundColor: '#ecf0f1',
    borderRadius: 8,
    position: "relative",
  },
});
