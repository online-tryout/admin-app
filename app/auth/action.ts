"use server";

import { User } from "@/models/model";
import { serverAxios } from "@/utils/axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signin(
  email: string,
  password: string
): Promise<{ accessToken: string; user: User }> {
  "use server";
  try {
    password = btoa(password)
    const { data } = await serverAxios.post<{
      user: User;
      accessToken: string;
    }>("/api/db/auth/login_admin", { email, password });
    cookies().set("accessToken", data.accessToken);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function google(
  token: string
): Promise<{ accessToken: string; user: User }> {
  "use server";
  try {
    const { data } = await serverAxios.post<{
      user: User;
      accessToken: string;
    }>("/api/auth/google", { token });

    cookies().set("accessToken", data.accessToken);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function signup(
  email: string,
  name: string,
  password: string
): Promise<{ accessToken: string; user: User }> {
  "use server";
  try {
    password = btoa(password)
    const role_id = 1 
    const token = cookies().get("accessToken")?.value ?? "";
    const { data } = await serverAxios.post<{
      user: User;
      accessToken: string;
    }>("/api/db/auth/register", { email, password, name, role_id, token });

    cookies().set("accessToken", data.accessToken);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  "use server";
  cookies().delete("accessToken");
  redirect("/auth");
}
