"use server";

import { CreateTryoutForm } from "@/components/tryout/list/tryout-list";
import { Chat, History, Tryout, User } from "@/models/model";
import { serverAxios } from "@/utils/axios";
import { cookies } from "next/headers";

export async function getTryOut(): Promise<{
  tryouts: Tryout[];
  message: string;
}> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.get<{
      tryouts: Tryout[];
      message: string;
    }>("/api/db/tryout", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createTryout(tryout: CreateTryoutForm): Promise<{
  message: string;
}> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.post<{
      message: string;
    }>("/api/tryout/new", tryout, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHistory(): Promise<{
  histories: History[];
}> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.get<{
      histories: History[];
    }>("/api/chats/histories", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getChatsDetails(uid: string): Promise<{
  chats: Chat[];
  user: User;
}> {
  "use server";
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const { data } = await serverAxios.get<{
      chats: Chat[];
      user: User;
    }>(`/api/chats/${uid}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return data;
  } catch (error) {
    throw error;
  }
}
