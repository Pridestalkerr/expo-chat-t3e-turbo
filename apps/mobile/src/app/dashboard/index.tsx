import React from "react";
import { Pressable, Button, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Link, router } from "expo-router";
import { Appearance, useColorScheme } from "react-native";
import { DefaultButton } from "~/components/Button";

const Index = () => {
  // const utils = api.useContext();

  // const postQuery = api.post.all.useQuery();

  // const deletePostMutation = api.post.delete.useMutation({
  //   onSettled: () => utils.post.all.invalidate(),
  // });

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <SafeAreaView className="bg-[#F7ECDE]">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "chattr", headerTintColor: "#F7ECDE" }} />
      <View className="h-full w-full p-4 flex items-center justify-center">
        <View className="flex-grow w-full flex items-center justify-center">
          <Text className="pb-2 text-5xl font-bold text-black mx-auto py-8 text-center">
            Welcome to <Text className="text-[#774360] text-6xl">chattr</Text>
          </Text>
          <Pressable
            className="w-full rounded-sm bg-[#774360] flex items-center justify-center p-2 my-1"
            onPress={() => {
              router.push("/auth/login");
            }}
          >
            <Text className="text-1xl font-medium text-[#F7ECDE]">LOGIN</Text>
          </Pressable>
          <Pressable
            className="w-full rounded-sm bg-[#774360] flex items-center justify-center p-2 my-1"
            onPress={() => {
              router.push("/auth/register");
            }}
          >
            <Text className="text-1xl font-medium text-[#F7ECDE]">
              REGISTER
            </Text>
          </Pressable>
        </View>
        <Image
          className="w-64 h-64"
          source="https://thenounproject.com/api/private/icons/2075885/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0"
          // contentFit="cover"
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
