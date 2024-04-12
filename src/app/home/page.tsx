"use client";
import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      <Flex flexWrap="wrap">
        {transactions?.data.map((invoice) => (
          <Box ml="5" mt="10" key={invoice._id}>
            <Link href={`/transaction?transactionId=${invoice._id}`}>
              <Box
                w="80"
                h="48"
                borderRadius="lg"
                shadow="md"
                p="10"
                borderColor="grey.100"
                borderWidth="1px"
                position="relative"
              >
                <Flex justifyContent="space-between" mb="5">
                  <Badge p="1" px="3" borderRadius="lg">
                    {new Date(invoice.createdAt).toDateString()}
                  </Badge>
                </Flex>
                <Text>
                  Customer :{" "}
                  <Box as="span" fontWeight="semibold">
                    {
                      masterData?.customerInfo?.find(
                        (info) => info._id === invoice.customerInfoId
                      )?.name
                    }
                  </Box>
                </Text>
                <Text mt="5">
                  Contractor :{" "}
                  <Box as="span" fontWeight="semibold">
                    {
                      masterData?.contractorInfo?.find(
                        (info) => info._id === invoice.contractorInfoId
                      )?.name
                    }
                  </Box>
                </Text>
              </Box>
            </Link>
          </Box>
        ))}
        <Link href={`/transaction`}>
          <Box
            w="80"
            h="48"
            borderRadius="lg"
            shadow="md"
            p="10"
            position="relative"
            borderColor="navy"
            mt="10"
            ml="5"
            bg="skyblue"
            textAlign="center"
          >
            <Text color="white" fontSize="32px" fontWeight="bold">
              +
            </Text>
            <Text color="white" fontSize="22px" fontWeight="semibold">
              Start new transaction
            </Text>
          </Box>
        </Link>
      </Flex>
    </Box>
  );
};

export default Home;
