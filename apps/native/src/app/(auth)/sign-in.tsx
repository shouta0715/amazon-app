import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as v from "valibot";
import { cn } from "@/utils/cn";

const signInSchema = v.object({
  identifier: v.pipe(
    v.string(),
    v.minLength(3, "Please enter a valid mobile number or email"),
  ),
  password: v.pipe(
    v.string("Please enter your password"),
    v.minLength(8, "Password must be at least 8 characters long"),
  ),
});
type SignInForm = v.InferOutput<typeof signInSchema>;

const Page = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: valibotResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const { signUp, isLoaded: isLoadedSignUp } = useSignUp();

  const onSubmit = async (data: SignInForm) => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.dismissTo("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const errors = err.errors;
        if (errors[0].code === "form_identifier_not_found") {
          void createAccount(data);
        } else {
          console.error(JSON.stringify(err, null, 2));
          Alert.alert("Error", "An error occurred while signing in");
        }
      }
    }
  };

  const createAccount = async (data: SignInForm) => {
    if (!isLoadedSignUp) return;
    try {
      await signUp.create({
        emailAddress: data.identifier,
        password: data.password,
      });

      router.dismissTo("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const signInWithPasskey = async () => {
    try {
      const signInAttempt = await signIn?.authenticateWithPasskey({
        flow: "discoverable",
      });

      if (signInAttempt?.status === "complete") {
        if (setActive !== undefined) {
          await setActive({ session: signInAttempt.createdSessionId });
          router.dismissTo("/");
        }
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <View className="p-4">
        <Text className="mb-2 text-2xl font-bold">
          Sign in or create an account
        </Text>
        <Text className="mb-2 text-base font-medium">
          Enter mobile number or email
        </Text>
        <Controller
          control={control}
          name="identifier"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoCapitalize="none"
              className="mb-2 rounded-md border border-gray-300 bg-white px-3 py-2"
              keyboardType="email-address"
              placeholder="Mobile number or email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.identifier && (
          <Text className="mb-2 text-red-500">{errors.identifier.message}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              accessibilityLabel="Amazon password"
              autoCapitalize="none"
              autoCorrect={false}
              className="mb-2 rounded-md border border-gray-300 bg-white px-3 py-2"
              placeholder="Amazon password"
              secureTextEntry={!showPassword}
              textContentType="password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text className="mb-2 text-red-500">{errors.password.message}</Text>
        )}

        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: showPassword }}
          className="mb-4 flex-row items-center"
          testID="show-password-checkbox"
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <View
            className={cn(
              "mr-2 h-5 w-5 items-center justify-center rounded border border-gray-400",
              showPassword ? "border-green-600 bg-green-100" : "bg-white",
            )}
          >
            {showPassword && <View className="h-3 w-3 rounded bg-green-600" />}
          </View>
          <Text className="text-base">Show password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mb-4 items-center rounded-full bg-yellow-400 py-3"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-lg font-medium text-black">Sign in</Text>
        </TouchableOpacity>

        <View className="mb-4 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-2 text-gray-500">Or</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>
        <TouchableOpacity
          className="mb-6 items-center rounded-full border border-gray-400 bg-white py-3"
          onPress={signInWithPasskey}
        >
          <Text className="text-lg font-medium text-black">
            Sign in with a passkey
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Page;
