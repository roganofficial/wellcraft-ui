"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Image from "next/image";

const DownloadJobCard = () => {
  const searchParams = useSearchParams();

  const jobCardId = searchParams.get("jobCardId");
  const transactionId = searchParams.get("transactionId");
  //   const costType = searchParams.get("costType") ?? "size";
  const componentRef = useRef(null);
  const [costType, setCostType] = useState("size");
  const [masterData, setMasterData] = useState(null);
  const [unitPrice, setUnitPrice] = useState();

  const fetchFirstMaster = () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}master`)
      .then((res) => {
        const masterData = res.data;
        console.log(masterData);
        setMasterData(res.data);
      });
  };

  const downloadPDF = async () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [760, 1074],
      });
      pdf.addImage(imgData, "PNG", 0, 0);
      const pdfName = new Date(Date.now()).toDateString();
      pdf.save(
        `${
          masterData?.customerInfo?.find(
            (info) => info._id === transaction?.data?.customerInfoId
          )?.name
        }-${pdfName}.pdf`
      );
      // Specify the name of the downloaded PDF file
    });
  };

  async function fetchTransaction() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction/one?transactionId=${transactionId}`
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchJobCard = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}jobCards/one?jobCardId=${jobCardId}`
      );
      console.log(response.data);
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const { data: currentJobCard, isLoading: isCurrentJobCardLoading } = useQuery(
    {
      queryKey: ["fetch-job-card"],
      queryFn: fetchJobCard,
    }
  );

  console.log(currentJobCard);

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["fetch-transaction"],
    queryFn: fetchTransaction,
  });

  async function getJobCards() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}jobCards?transactionId=${transactionId}`
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  const {
    data: jobCards,
    isLoading: isLoadingJobCard,
    refetch: refetchJobCards,
  } = useQuery({
    queryKey: ["jobCards"],
    queryFn: getJobCards,
  });

  useEffect(() => {
    fetchFirstMaster();
  }, []);

  useEffect(() => {
    if (costType === "size") {
      setUnitPrice(masterData?.pricePerSqFeet);
    } else {
      setUnitPrice(masterData?.pricePerHour);
    }
  }, [costType, masterData]);

  if (isLoading || isLoadingJobCard) return <></>;

  const getTotalQuantity = () => {
    let result = 0;
    jobCards?.data?.forEach((data) => {
      result += Number(data.quantity);
    });
    return result;
  };

  const getTotalMeasurment = () => {
    let result = 0;
    jobCards?.data?.forEach((data) => {
      const totalArea =
        Number(data.height) * Number(data.width) * Number(data.quantity);
      const sqFeetArea = totalArea / (data.sizeUnit === "mm" ? 92900 : 144);
      result += sqFeetArea;
    });
    return result.toFixed(2);
  };

  const totalTimeOfWork =
    jobCards?.data
      ?.map((e) => Number(e.timeOfWork))
      .reduce((a, b) => a + b, 0) / 60;

  const amount = (
    costType === "size"
      ? getTotalMeasurment() * unitPrice
      : (totalTimeOfWork * unitPrice).toFixed(2)
  ).toLocaleString();

  const Invoice = () => {
    return (
      <Box borderWidth="1px" borderColor="black" p="5" ref={componentRef}>
        <Flex justifyContent="space-between">
          <Image
            src={require("../../../public/logo.png")}
            alt="logo"
            width={200}
            height={100}
          />
          <Text
            fontSize="22"
            color="maroon"
            fontWeight="semibold"
            letterSpacing="5px"
          >
            Job Card
          </Text>
        </Flex>
        <Flex justifyContent="flex-end" mt="5">
          <Box>
            <Text>
              <Box as="span" fontWeight="semibold">
                Opening Date :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {new Date(currentJobCard?.data?.createdAt).toDateString()}
              </Box>
            </Text>
            <Text mt="3">
              <Box as="span" fontWeight="semibold">
                Closing Date:
              </Box>
              <Box as="span" ml="3" minW="48">
                <i>...................</i>
              </Box>
            </Text>
          </Box>
        </Flex>
        <Flex mt="2">
          <Box>
            <Text fontSize="16">
              <Box as="span" fontWeight="semibold">
                Customer :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {
                  masterData?.customerInfo?.find(
                    (info) => info._id === transaction?.data?.customerInfoId
                  )?.name
                }
              </Box>
            </Text>
            <Text mt="2" fontSize="16">
              <Box as="span" fontWeight="semibold" mr="0">
                Phone :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {
                  masterData?.customerInfo?.find(
                    (info) => info._id === transaction?.data?.customerInfoId
                  )?.phone
                }
              </Box>
            </Text>
          </Box>
          <Box ml="5">
            <Text fontSize="16">
              <Box as="span" fontWeight="semibold">
                Contractor :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {
                  masterData?.contractorInfo?.find(
                    (info) => info._id === transaction?.data?.contractorInfoId
                  )?.name
                }
              </Box>
            </Text>
            <Text mt="2" fontSize="16">
              <Box as="span" fontWeight="semibold" mr="0">
                Phone :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {
                  masterData?.contractorInfo?.find(
                    (info) => info._id === transaction?.data?.contractorInfoId
                  )?.phone
                }
              </Box>
            </Text>
          </Box>
        </Flex>
        <TableContainer mt="5">
          <Table variant="simple">
            <Thead bg="maroon">
              <Tr>
                <Th color="white" px="0" pl="1">
                  Sr. No
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Description
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Size
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Qty
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Machine
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Time of work
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Remark
                </Th>
              </Tr>
            </Thead>
            <Tbody borderLeft="1px maroon solid">
              {currentJobCard?.data?.jobCardEntries.map(
                (jobCardEntry, index) => (
                  <Tr key={index}>
                    <Td
                      borderRight="1px maroon solid"
                      px="0"
                      textAlign="center"
                    >
                      1
                    </Td>
                    <Td borderRight="1px maroon solid" pr="0">
                      <ul>{jobCardEntry?.description}</ul>
                    </Td>
                    <Td borderRight="1px maroon solid" px="2">
                      {jobCardEntry?.width} x {jobCardEntry?.height}{" "}
                      {jobCardEntry?.sizeUnit}
                    </Td>
                    <Td
                      borderRight="1px maroon solid"
                      px="2"
                      textAlign="center"
                    >
                      {jobCardEntry?.quantity}
                    </Td>
                    <Td
                      borderRight="1px maroon solid"
                      px="2"
                      textAlign="center"
                    >
                      {jobCardEntry?.machineNumber}
                    </Td>
                    <Td
                      borderRight="1px maroon solid"
                      px="2"
                      textAlign="center"
                    >
                      {jobCardEntry?.timeOfWork} mins
                    </Td>
                    <Td
                      borderRight="1px maroon solid"
                      px="2"
                      textAlign="center"
                    >
                      {jobCardEntry?.remark}
                    </Td>
                  </Tr>
                )
              )}
              {Array.from({
                length: 6 - currentJobCard?.data?.jobCardEntries?.length,
              }).map((_, index) => (
                <Tr key={index}>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box p="10" px="0">
      <Flex pl="10" alignItems="center">
        <IconButton
          width="10"
          height="10"
          size="sm"
          icon={<ArrowBackOutlinedIcon />}
          aria-label="back-button"
          background="grey.100"
          as="a"
          href={`/transaction?transactionId=${transactionId}`}
        />
        <Heading ml="10">Download Job Card</Heading>
      </Flex>
      <Flex my="5" w="full" alignItems="center" justifyContent="space-around">
        <Button bg="green.300" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Flex>
      <Invoice />
    </Box>
  );
};

export default DownloadJobCard;
