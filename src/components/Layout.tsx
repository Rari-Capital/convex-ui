import { Box } from "@chakra-ui/react";
import Header from "./Header";

export const Layout = ({ children }: { children: any }) => {
  return (
    <Box pb={16}>
      <Header px={16} pb={40} position="relative" zIndex={0} />
      <Box px={16} mt={-20} position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
