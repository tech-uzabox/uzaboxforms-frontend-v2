import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const cookies = new Cookies();

  useEffect(() => {
    const storedToken = cookies.get("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  console.log("token", token)
  return token;
}
