import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { useRouter } from "next/router";
  import pb from "../lib/pocketbase";
  import { Record } from "pocketbase";
  
  interface PbUser {
    id: string;
    name: string;
    email: string;
    username: string;
    avatarUrl: string;
  }
  
  interface AuthContextType {
    user: PbUser | null;
    signIn: (email: string, password: string) => void;
    setUserData: (user: PbRecord) => void;
    signOut: () => void;
  }
  
  const AuthContext = createContext<AuthContextType | null>(null);
  
  const AuthWrapper: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
  
    const [user, setUser] = useState<PbUser | null>(null);
  
    useEffect(() => {
      if (pb.authStore.model) setUserData(pb.authStore.model as PbRecord);
    }, []);
  
    const setUserData = (pbUser: PbRecord) => {
      const { id, name, email, username, avatarUrl } = pbUser;
      setUser({ id, name, email, username, avatarUrl });
    };
  
    const signIn = async (email: string, password: string) => {
      try {
        const user = await pb.authStore.signIn(email, password);
        setUserData(user);
      } catch (error) {
        console.error(error);
      }
    };
  
    const signOut = () => {
      setUser(null);
      pb.authStore.clear();
    };
  
    return (
      <AuthContext.Provider
        value={{ user, signIn, setUserData, signOut }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const usePbAuth = () => useContext(AuthContext) as AuthContextType;
  export default AuthWrapper;
  