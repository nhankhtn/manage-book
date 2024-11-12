import { useRouter } from 'next/navigation';

const { useStore } = require("@/hooks/useStore");

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const { state: { user } } = useStore();

    // if (!user) {
    //     router.push("/auth/login");
    //     return null
    // }

    return <>{children}</>;
}
export default AuthGuard;