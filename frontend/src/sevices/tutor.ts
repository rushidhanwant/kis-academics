'use client'
import {omitBy, isEmpty} from "lodash";
import { TutorSearchOptions } from "./types";
import client from "./client";

export const search = async (options: TutorSearchOptions) => {
  try {
    const response = await client.get("/tutors/search", {
      params: omitBy(options, (value: any): boolean => {
        if (typeof value === "number") return false;
        return isEmpty(value);
      }),
    });
    return response.data;
  } catch (err) {
    return undefined;
  }
};

export const getProfile = async (tutorId: string) => {
  try {
    const response = await client.get(`/tutors/${tutorId}`);
    return response.data;
  } catch (err) {
    return undefined;
  }
};

export const request = async (
  tutorId: string,
  data: { name: string; message: string }
) => {
  try {
    const response = await client.put(`/tutors/${tutorId}/request`, data);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};
