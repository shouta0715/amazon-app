import "@/styles/tailwind.css";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { StyledStack } from "@/components/navigation/stack";
import { Providers } from "@/features/providers";

function RootLayout() {
  const router = useRouter();

  return (
    <Providers>
      <StyledStack
        contentClassName="bg-gray-100"
        headerClassName="bg-dark text-white"
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)"
          options={{
            title: "Amazon",
            presentation: "fullScreenModal",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-lg text-white">Cancel</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="(modal)/rufus"
          options={{
            title: "Rufus",
            presentation: "formSheet",
            headerTintColor: "#000",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.dismiss()}>
                <Ionicons color="text-gray-400" name="close" size={24} />
              </TouchableOpacity>
            ),
            sheetAllowedDetents: [0.45, 0.95],
            sheetGrabberVisible: true,
            sheetInitialDetentIndex: 0,
          }}
        />
      </StyledStack>
    </Providers>
  );
}

export default RootLayout;
