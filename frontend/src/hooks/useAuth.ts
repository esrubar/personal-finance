import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAuth() {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          withCredentials: true, // Muy importante: envía cookies httpOnly
        });

        if (res.status === 200) {
          setLogged(true);
        } else {
          setLogged(false);
        }
      } catch (err) {
        setLogged(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { logged, loading };
}
