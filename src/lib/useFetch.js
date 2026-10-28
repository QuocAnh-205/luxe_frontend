import { useEffect, useState } from 'react';
import { api } from './api';

export function useFetch(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
  }, [path]);

  return state;
}
