import Head from "next/head";
import React, { useContext } from "react";
import { AlertProvider } from "./AlertProvider";
import { AuthGuard } from "./AuthGuard";
import { DialogProvider } from "./DialogProvider";
import { FetchContext, FetchProvider } from "./FetchProvider";
import { BasePageProps } from "./type";

export const BasePage = ({ children, title }: BasePageProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <AlertProvider>
        <FetchProvider>
          <AuthGuard>
            <DialogProvider>
              {children}
            </DialogProvider>
          </AuthGuard>
        </FetchProvider>
      </AlertProvider>
    </>
  );
};

export const useFetch = () => useContext(FetchContext);
