import "../../styles/globals.css";
import { Provider } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { connectors, defaultProvider } from "utils/connectors";
import { RariProvider } from "context";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from  "react-query/devtools"

function MyApp({ Component, pageProps }: any) {
  
const queryClient = new QueryClient()
  return (
    <ChakraProvider>
      <Provider autoConnect defaultProvider={defaultProvider} connectors={connectors}>
        <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
          <RariProvider poolId={"156"}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RariProvider>
        </QueryClientProvider>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
