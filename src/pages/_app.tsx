// @ts-nocheck
import "rari-components/assets/fonts/avenir-next/avenir.css";
import 'styles/styles.css'
import { Provider } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "rari-components/theme";
import Layout from "../components/Layout";
import { connectors } from "utils/connectors";
import { RariProvider } from "context/RariContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { PoolProvider } from "context/PoolContext";

function MyApp({ Component, pageProps }: any) {
  const queryClient = new QueryClient();
  return (
    <ChakraProvider theme={theme}>
      <Provider autoConnect connectors={connectors}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <RariProvider>
            <PoolProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </PoolProvider>
          </RariProvider>
        </QueryClientProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
