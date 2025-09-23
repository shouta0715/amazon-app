import "@/styles/tailwind.css";
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
      </StyledStack>
    </Providers>
  );
}

export default RootLayout;
