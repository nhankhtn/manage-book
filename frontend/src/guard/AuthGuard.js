import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSessionData } from "@/actions";

const { useStore } = require("@/hooks/useStore");

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const {
    state: { user },
    setUser,
  } = useStore();
  const [prevUser, setPrevUser] = useState(null);
  useEffect(() => {
    console.log(user);
    if (
      user !== null &&
      (prevUser === null ||
        (user.username === prevUser.username && user.role === prevUser.role))
    )
      return;
    async function getSession() {
      const sessionData = await getSessionData();
      if (sessionData) {
        setUser(sessionData);
        setPrevUser(sessionData);
      } else {
        router.push("/auth/login");
      }
    }
    getSession();
    // if (!user) {
    //     router.push("/auth/login");
    // }
  }, [user, router]);
  if (!user) {
    return null;
  }

  return <>{children}</>;
};
export default AuthGuard;
