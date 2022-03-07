import { Box } from "@chakra-ui/react";
import Faq from "components/pages/Faq";
import Head from "next/head";

const FaqPage = () => {
  return (
    <Box>
      <Head>
        <title>FAQ | Tribe Convex Pool</title>
        <meta name="description" content="Tribe Convex Pool" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Faq />
    </Box>
  );
};

export default FaqPage;
