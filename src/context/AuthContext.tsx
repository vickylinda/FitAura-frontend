import { createContext, useContext, useState, useEffect } from "react";

type User = { id: number; name: string, isTrainer: boolean;
  profilePic?: string; };

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("fitauraUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fitauraUser");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("fitauraUser");
    const token = localStorage.getItem("token");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    if (!token) {
      setLoading(false);
      return;
    }

    // Verifica si el token aún es válido, pero no borra el user si ya lo cargamos
    fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then(async(data) => {
        const firstName = data.name?.split(" ")[0] || "Usuaria";
        let profilePic = null;
              if (data.isTrainer) {
        const trainerRes = await fetch(
          `${import.meta.env.VITE_API_URL}/trainers/${data.id}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (trainerRes.ok) {
          const trainerData = await trainerRes.json();
          profilePic = trainerData.profilePic || null;
        }
      }

        const updatedUser = { id: data.id, name: firstName , isTrainer: data.isTrainer, profilePic};
        setUser(updatedUser);
        localStorage.setItem("fitauraUser", JSON.stringify(updatedUser));
      })
      .catch((err) => {
        console.warn("Token inválido o expirado:", err.message);
        if (!storedUser) logout(); // solo logout si no teníamos user
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
