import React, { useEffect } from "react";
import { Pressable, Button, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Link, router } from "expo-router";
import { Appearance, useColorScheme } from "react-native";
import { DefaultButton } from "~/components/Button";
import { useToken } from "./_layout";
// import { FlashList } from "@shopify/flash-list";

// import { api } from "~/utils/api";
// import type { RouterOutputs } from "~/utils/api";

// function PostCard(props: {
//   post: RouterOutputs["post"]["all"][number];
//   onDelete: () => void;
// }) {
//   const router = useRouter();

//   return (
//     <View className="flex flex-row rounded-lg bg-white/10 p-4">
//       <View className="flex-grow">
//         <TouchableOpacity onPress={() => router.push(`/post/${props.post.id}`)}>
//           <Text className="text-xl font-semibold text-pink-400">
//             {props.post.title}
//           </Text>
//           <Text className="mt-2 text-white">{props.post.content}</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity onPress={props.onDelete}>
//         <Text className="font-bold uppercase text-pink-400">Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// function CreatePost() {
//   const utils = api.useContext();

//   const [title, setTitle] = React.useState("");
//   const [content, setContent] = React.useState("");

//   const { mutate, error } = api.post.create.useMutation({
//     async onSuccess() {
//       setTitle("");
//       setContent("");
//       await utils.post.all.invalidate();
//     },
//   });

//   return (
//     <View className="mt-4">
//       <TextInput
//         className="mb-2 rounded bg-white/10 p-2 text-white"
//         placeholderTextColor="rgba(255, 255, 255, 0.5)"
//         value={title}
//         onChangeText={setTitle}
//         placeholder="Title"
//       />
//       {error?.data?.zodError?.fieldErrors.title && (
//         <Text className="mb-2 text-red-500">
//           {error.data.zodError.fieldErrors.title}
//         </Text>
//       )}
//       <TextInput
//         className="mb-2 rounded bg-white/10 p-2 text-white"
//         placeholderTextColor="rgba(255, 255, 255, 0.5)"
//         value={content}
//         onChangeText={setContent}
//         placeholder="Content"
//       />
//       {error?.data?.zodError?.fieldErrors.content && (
//         <Text className="mb-2 text-red-500">
//           {error.data.zodError.fieldErrors.content}
//         </Text>
//       )}
//       <TouchableOpacity
//         className="rounded bg-pink-400 p-2"
//         onPress={() => {
//           mutate({
//             title,
//             content,
//           });
//         }}
//       >
//         <Text className="font-semibold text-white">Publish post</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

const Index = () => {
  // const utils = api.useContext();

  // const postQuery = api.post.all.useQuery();

  // const deletePostMutation = api.post.delete.useMutation({
  //   onSettled: () => utils.post.all.invalidate(),
  // });

  // const [] = useToken();
  const { token, setToken } = useToken();

  useEffect(() => {
    if (token !== "") {
      router.replace("/dashboard");
    }
  }, [token]);

  return (
    <SafeAreaView className="bg-[#F7ECDE]">
      {/* Changes page title visible on the header */}
      <Stack.Screen
        options={{ title: "Welcome", headerTintColor: "#F7ECDE" }}
      />
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
          <Pressable
            className="w-full rounded-sm bg-[#774360] flex items-center justify-center p-2 my-1"
            onPress={() => {
              router.push("/dashboard");
            }}
          >
            <Text className="text-1xl font-medium text-[#F7ECDE]">
              dashboard
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
