import { useEffect, useState, useCallback } from 'react';

function useRequest<P, T>(api: (params: P) => Promise<T>, params?: P|undefined, visiable = true)
  :[boolean, T|undefined, (params?: P) => any, Function] {
  const [res, setRes] = useState<T>();
  const [loading, setLoading] = useState(() => false);
  const [newParams, setNewParams] = useState<P|undefined>(() => params);
  const [autoFetch, setAutoFetch] = useState(() => visiable);

  const fetch = useCallback(async () => {
    if (autoFetch) {
      if (newParams === undefined) return;
      setLoading(true);
      const tmp = await api(newParams);
      setRes(tmp);
      setLoading(false);
    }
  }, [api, autoFetch, newParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const doFetch = useCallback((rest = null) => {
    setNewParams(rest);
    setAutoFetch(true);
  }, []);

  const reFetch = () => {
    if (newParams) setNewParams({ ...newParams });
  };

  return [loading, res, doFetch, reFetch];
}

export default useRequest;
