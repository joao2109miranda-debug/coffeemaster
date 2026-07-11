import Context from 'pages/Context';
import { useEffect, useState } from 'react';
import supabase from 'services/supabase';

const Provider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sessão inicial (persistida no localStorage pelo supabase-js)
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        // Reage a login/logout/refresh de token
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    const user = session?.user ?? null;

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <Context.Provider value={{ session, user, loading, signOut }}>
            {children}
        </Context.Provider>
    );
};

export default Provider;
