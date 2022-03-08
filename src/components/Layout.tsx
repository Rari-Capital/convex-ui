import { Box } from "@chakra-ui/react";
import Header from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: any }) => {
  return (
    <Box pb={10}>
      <Header
        pb={40}
        position="relative"
        zIndex={0}
        contentSx={{
          maxWidth: ["90vw", "90vw", "90vw", "70vw"],
          margin: "0 auto",
        }}
      />
      <Box
        position="relative"
        zIndex={1}
        maxWidth={["90vw", "90vw", "90vw", "70vw"]}
        margin="0 auto"
        mt={-20}
      >
        {children}
      </Box>
      <Footer/>
    </Box>
  );
};

export default Layout;
