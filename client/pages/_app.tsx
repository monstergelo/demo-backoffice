import { BasePage } from "module/BasePage";
import React from "react";
import "../styles/globals.css";
import { MyAppProps } from "../module/types";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

/**
 * Main App render function.
 * @return {AppProps} rendered page.
 */
function MyApp({ Component, pageProps }: MyAppProps) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const title = Component.title;
  const props = {
    ...pageProps,
    title
  }

  return (
    <ThemeProvider theme={theme}>
      <BasePage title={title}>
        <Layout {...props}>
          <Component {...pageProps} />
        </Layout>
      </BasePage>
    </ThemeProvider>
  );
}

export default MyApp;
