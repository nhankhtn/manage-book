import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { useStore } = require("@/hooks/useStore");

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const { state: { user } } = useStore();
    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
        }
    }, [user, router]);
    if (!user) {
        return null
    }

    return <>{children}</>;
}
export default AuthGuard;