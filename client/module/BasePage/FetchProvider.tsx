import React, { createContext, useContext, useMemo } from "react";
import { AlertContext } from "./AlertProvider";
import { fetchType, FetchContextProps, GenericProviderProps } from "./type";
 
const defaultValue: FetchContextProps = {
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000',
  options: {
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  },
  get: (url, customOption = {}) => fetch(url, {method: 'GET', ...customOption}).then((res) => res.json()),
  put: (url, customOption = {}) => fetch(url, {method: 'PUT', ...customOption}).then((res) => res.json()),
  post: (url, customOption = {}) => fetch(url, {method: 'POST', ...customOption}).then((res) => res.json()),
  remove: (url, customOption = {}) => fetch(url, {method: 'DELETE', ...customOption}).then((res) => res.json()),
  loading: false,
}

export const FetchContext = createContext(defaultValue)
export const FetchProvider = ({ children }: GenericProviderProps) => {
  const { alert } = useContext(AlertContext);
  const fetchOptions = useContext(FetchContext);

  const contextValue: FetchContextProps = useMemo(() => {
      const customFetch = (method: string): fetchType => (url, customOption = {}) => {
        const body = customOption?.body ? JSON.stringify(customOption?.body) : null
        const urlString = new URL(fetchOptions.baseURL + url);
    
        if (customOption?.params && Object.keys(customOption?.params).length > 0) {
          const urlSearchParams = new URLSearchParams();
          Object.keys(customOption?.params).forEach((paramKey: string) => { 
            const param = customOption?.params[paramKey];
    
            if(Array.isArray(param)) {
              param.forEach((val) => {
                urlSearchParams.append(paramKey, val)
              })
            } else {
              urlSearchParams.append(paramKey, param)
            }
          });
          urlString.search = urlSearchParams.toString();
      }
  
      return fetch(urlString, {method: method, ...fetchOptions.options, ...customOption, body})
      .then( async (res) => {
        return res.json().then((response) => {
          if(response.error && response?.statusCode !== 200) {
            alert(response?.message, 'error')
          }
          else if(method !== 'GET') {
            alert('success', 'success')
          }

          return response
        })
      }).catch((e) => {
        alert(e.message, 'error')
      })
    }
    
    return {
      ...fetchOptions,
      get: customFetch('GET'),
      put: customFetch('PUT'),
      post: customFetch('POST'),
      remove: customFetch('DELETE'),
    }
  }, [fetchOptions, alert])

  return (
    <FetchContext.Provider value={contextValue}>
      {children}
    </FetchContext.Provider>
  );
};
