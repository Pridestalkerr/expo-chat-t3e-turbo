import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, createContext } from "react";

import { TRPCProvider } from "~/utils/trpc";
import * as SecureStore from "expo-secure-store";

const tokenContext = createContext<{
  token: string;
  setToken: (token: string) => void;
}>({
  token: "",
  setToken: () => void 0,
});

export const useToken = () => useContext(tokenContext);

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  const [token, setToken] = React.useState<string>("");

  // ad hoc solution
  useEffect(() => {
    if (token !== "") {
      router.replace("/dashboard");
    }
  }, [token]);

  useEffect(() => {
    SecureStore.getItemAsync("token")
      .then((token) => {
        setToken(token || "");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    SecureStore.setItemAsync("token", token).catch((err) => {
      console.log(err);
    });
  }, [token]);

  return (
    <TRPCProvider>
      <tokenContext.Provider value={{ token, setToken }}>
        <SafeAreaProvider>
          {/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: "#000",
              },
            }}
          />
          {/* <StatusBar /> */}
        </SafeAreaProvider>
      </tokenContext.Provider>
    </TRPCProvider>
  );
};

export default RootLayout;
