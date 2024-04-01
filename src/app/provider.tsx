"use client";

import { ChakraProvider } from "@chakra-ui/react";

const Provider = ({
  children,
}: // allCookies,
{
  children: React.ReactNode;
  // allCookies: RequestCookie[];
}) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

export default Provider;
