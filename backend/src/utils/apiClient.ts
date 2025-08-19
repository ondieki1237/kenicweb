// src/utils/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  timeout: 20000,
});
