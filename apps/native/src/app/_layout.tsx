import "@/styles/tailwind.css";
import { Stack } from "expo-router";
import React from "react";
import { StyledStack } from "@/components/navigation/stack";
import { Providers } from "@/features/providers";
export default function RootLayout() {
  return (
    <Providers>
      <StyledStack
        contentClassName="bg-gray-100"
        headerClassName="bg-dark text-white"
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </StyledStack>
    </Providers>
  );
}
