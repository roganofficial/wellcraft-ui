"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Provider = ({
  children,
}: // allCookies,
{
  children: React.ReactNode;
  // allCookies: RequestCookie[];
}) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {children}
        <ToastContainer />
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default Provider;
