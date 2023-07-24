import React from "react";
import { Pressable, Button, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Link, router } from "expo-router";
import { Appearance, useColorScheme } from "react-native";
import { DefaultButton } from "~/components/Button";
import { useToken } from "~/app/_layout";
import { api } from "~/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addFriendSchema = z.object({
  username: z.string().min(6),
});

const Index = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof addFriendSchema>>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      username: "",
    },
  });

  const { token, setToken } = useToken();

  const { data, refetch, error } = api.auth.me.useQuery({
    token: token,
  });

  return (
    <SafeAreaView className="bg-[#F7ECDE]">
      {/* Changes page title visible on the header */}
      <Stack.Screen
        options={{ title: data?.username, headerTintColor: "#F7ECDE" }}
      />
      <View className="h-full w-full p-4 m-0">
        {/* <Text className="pb-2 text-3xl font-bold text-774360 text-right">
          {data?.username && `Welcome back, ${data?.username}!`}
        </Text>
        {error && (
          <Text className="text-2xl font-bold text-[#ff0000]">
            Something went wrong... {error.message}
          </Text>
        )} */}

        <Text className="text-1xl font-bold text-[#000] pb-1">
          Start a conversation with someone
        </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="mb-2 rounded bg-black p-2 text-[#F7ECDE] w-full"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              placeholder="Search..."
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect={false}
            />
          )}
          name="username"
        />
        {errors.username && <Text>{errors.username}</Text>}

        <View className="flex-grow w-full flex items-center justify-center"></View>
        {/* <Image
          className="w-64 h-64"
          source="https://thenounproject.com/api/private/icons/2075885/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0"
          // contentFit="cover"
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default Index;
