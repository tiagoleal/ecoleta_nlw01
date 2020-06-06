import React, { useState, useEffect, ChangeEvent } from "react";

import { Feather as Icon } from "@expo/vector-icons";

import {
  View,
  ImageBackground,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";

import axios from "axios";
import api from "../../services/api";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [uf, setSelectedUf] = useState("0");
  const [city, setSelectedCity] = useState("0");

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"
      )
      .then((response) => {
        const ufInitials: any[] = [];
        response.data.map((uf) =>
          ufInitials.push({
            label: uf.sigla,
            value: uf.sigla,
          })
        );

        // console.log(ufInitials);
        setUfs(ufInitials.sort());
      });
  }, []);

  useEffect(() => {
    // console.log("hook:" + uf);
    if (String(uf) === "") {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((response) => {
        const citiesIBGE: any[] = [];

        response.data.map((city) =>
          citiesIBGE.push({
            label: city.nome,
            value: city.nome,
          })
        );

        // console.log(citiesIBGE);
        setCities(citiesIBGE.sort());
      });
  }, [uf]);

  function handleSelectedUf(selectedUF: any) {
    // const uf = event.target.value;
    console.log(selectedUF);
    setSelectedUf(selectedUF);
  }

  function handleSelectedCity(selectedCity: any) {
    // const city = event.target.value;
    console.log(selectedCity);
    setSelectedCity(selectedCity);
  }

  function handleNavigateToPoints() {
    // console.log(uf, city);
    navigation.navigate("Points", { uf, city });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Text>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{
              label: "Estado (UF)",
              value: "0",
              color: "#9EA0A4",
            }}
            items={ufs}
            value={uf}
            // name="uf"
            onValueChange={(value) => handleSelectedUf(String(value))}
          />

          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{
              label: "Cidade",
              value: "0",
              color: "#9EA0A4",
            }}
            items={cities}
            value={city}
            // name="city"
            onValueChange={(value) => handleSelectedCity(String(value))}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
