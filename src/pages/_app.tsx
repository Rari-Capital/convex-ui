import "../../styles/globals.css";
import { Provider } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { connectors } from "utils/connectors";

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider>
      <Provider autoConnect connectors={connectors}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;
