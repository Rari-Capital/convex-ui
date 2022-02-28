import { Box } from "@chakra-ui/react";
import Claim from "components/pages/Claim";
import Head from "next/head";

const ClaimPage = () => {
  return (
    <Box>
      <Head>
        <title>Tribe Convex Pool</title>
        <meta name="description" content="Tribe Convex Pool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Claim />
    </Box>
  );
};

export default ClaimPage;
