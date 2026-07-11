import { createContext } from "react";

// Estado de autenticação baseado na sessão do Supabase.
const Context = createContext({
    session: null,
    user: null,
    loading: true,
    signOut: async () => {},
});

export default Context;
