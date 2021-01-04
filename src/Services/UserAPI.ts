import axios from "axios";

export interface User {
  id?: string;
  name: string;
  email: string;
  telephone: string;
}

export async function SaveUser(user: User) {
  var resp = await axios.post(
    "https://jsonplaceholder.typicode.com/users",
    user
  );

  return resp.data;
}
