import axios from "axios";
import type { User } from "./userType";

export const fetchUsersAPI = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(
    "https://jsonplaceholder.typicode.com/users"
  );

  return response.data;
};