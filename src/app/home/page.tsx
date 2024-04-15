"use client";
import { Badge, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Table, Tbody, Td, Th, Thead, Image, Tr } from "@chakra-ui/react";
import { Delete, Edit } from "@mui/icons-material";

const Home = () => {
  const [masterData, setMasterData] = useState(null);

  const fetchFirstMaster = () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}master`)
      .then((res) => {
        const masterData = res.data;
        setMasterData(res.data);
      });
  };

  async function fetAllTransactions() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction`
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetAllTransactions,
  });

  useEffect(() => {
    fetchFirstMaster();
  }, []);

  if (isLoading) return <></>;

  return (
    <Box p="10">
      <Heading ml="10">Transactions 📃</Heading>
      <Flex w="full" justifyContent="flex-end">
        <Button
          bg="blue.300"
          color="white"
          onClick={() => (window.location.href = "/transaction")}
        >
          Create Transaction
        </Button>
      </Flex>
      <Table variant="simple" mt="5">
        <Thead>
          <Tr>
            <Th borderWidth="1px" borderColor="gray.200" w="10">
              Sr. no.
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Customer Name
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Contractor Name
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Date Created
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions?.data.map((invoice, index) => (
            <Tr
              key={index}
              onClick={() =>
                (window.location.href = `/transaction?transactionId=${invoice._id}`)
              }
              _hover={{
                shadow: "md",
                cursor: "pointer",
                background: "skyblue",
              }}
              bg={index % 2 === 0 ? "gray.300" : "white"}
              transition="ease-in-out 0.3s "
            >
              <Td borderWidth="1px" borderColor="gray.200">
                <Text textAlign="center">{index + 1}</Text>
              </Td>
              <Td borderWidth="1px" borderColor="gray.200" maxW="32">
                {
                  masterData?.customerInfo?.find(
                    (info) => info._id === invoice.customerInfoId
                  )?.name
                }
              </Td>
              <Td borderWidth="1px" borderColor="gray.200">
                <Text>
                  {" "}
                  {
                    masterData?.contractorInfo?.find(
                      (info) => info._id === invoice.contractorInfoId
                    )?.name
                  }
                </Text>
              </Td>
              <Td borderWidth="1px" borderColor="gray.200">
                <Badge p="1" px="3" borderRadius="lg">
                  {new Date(invoice.createdAt).toDateString()}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Home;
