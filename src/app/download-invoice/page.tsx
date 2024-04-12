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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Image from "next/image";
import { toast } from "react-toastify";

const DownloadInvoice = () => {
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId");
  const jobCardId = searchParams.get("jobCardId");
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
    generateInvoice();
    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL("image/png");
    const numOfImgPages = Math.ceil(jobCards?.data?.length / 4);
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 0, 0);
    Array.from({ length: numOfImgPages }).forEach(async (_, pageNum) => {
      const imageCanvas = await html2canvas(
        document.getElementById(`image-cont-${pageNum}`)
      );
      const imgScreenShotData = imageCanvas.toDataURL("image/png");
      pdf.addPage();
      pdf.addImage(imgScreenShotData, "PNG", 0, 0);

      if (pageNum === numOfImgPages - 1) {
        const pdfName = new Date(Date.now()).toDateString();
        pdf.save(
          `${
            masterData?.customerInfo?.find(
              (info) => info._id === transaction?.data?.customerInfoId
            )?.name
          }-${pdfName}.pdf`
        );
      }
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

  useEffect(() => {
    fetchFirstMaster();
    console.log(jobCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (costType === "size") {
      setUnitPrice(masterData?.pricePerSqFeet);
    } else {
      setUnitPrice(masterData?.pricePerHour);
    }
  }, [costType, masterData]);

  if (isLoading || isLoadingJobCard || isCurrentJobCardLoading) return <></>;

  const getTotalQuantity = () => {
    let result = 0;
    currentJobCard?.data?.jobCardEntries?.forEach((data) => {
      result += Number(data.quantity);
    });
    return result;
  };

  const getTotalMeasurment = () => {
    let result = 0;
    currentJobCard?.data?.jobCardEntries?.forEach((data) => {
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

  const generateInvoice = () => {
    return axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction/invoice/new?transactionId=${transactionId}`,
        {
          costType,
          unitPrice,
        }
      )
      .then(() => toast("Invoice saved successfully", { type: "success" }))
      .catch((err) => toast("Failed to save invoice", { type: "error" }));
  };

  console.log(currentJobCard);

  const Invoice = () => {
    return (
      <Box
        borderWidth="1px"
        borderColor="black"
        p="5"
        ref={componentRef}
        maxW="640px"
      >
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
            letterSpacing="12px"
          >
            INVOICE
          </Text>
        </Flex>
        <Flex justifyContent="flex-end" mt="5">
          <Box>
            <Text>
              <Box as="span" fontWeight="semibold">
                Invoice/ :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {jobCardId}
              </Box>
            </Text>
            <Text mt="3">
              <Box as="span" fontWeight="semibold">
                Invoice Date:
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                <i>
                  {` ${new Date().getDate()}/ ${
                    new Date().getMonth() + 1
                  }/ ${new Date().getFullYear()}`}
                </i>
              </Box>
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Box>
            <Text fontSize="16">
              <Box as="span" fontWeight="semibold">
                Bill To :
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
        </Flex>
        <TableContainer mt="5">
          <Table variant="simple">
            <Thead bg="maroon">
              <Tr>
                <Th color="white" px="0" pl="1">
                  Item No
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Description
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Qty
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Unit Price
                </Th>
                <Th color="white" px="0" textAlign="center">
                  Amount
                </Th>
              </Tr>
            </Thead>
            <Tbody borderLeft="1px maroon solid">
              <Tr>
                <Td borderRight="1px maroon solid" px="0" textAlign="center">
                  1
                </Td>
                <Td borderRight="1px maroon solid" pr="0">
                  <ul>
                    {currentJobCard?.data.jobCardEntries?.map(
                      (jobCard, index) => (
                        <li key={index}>{jobCard.description}</li>
                      )
                    )}
                  </ul>
                </Td>
                <Td borderRight="1px maroon solid" px="2">
                  {costType === "size"
                    ? getTotalMeasurment()
                    : getTotalQuantity()}
                </Td>
                <Td borderRight="1px maroon solid" px="2" textAlign="center">
                  ₹{unitPrice}
                </Td>
                <Td borderRight="1px maroon solid" px="2" textAlign="center">
                  ₹{amount}
                </Td>
              </Tr>
              {Array.from({ length: 5 }).map((_, index) => (
                <Tr key={index}>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                </Tr>
              ))}
              <Tr borderRight="1px maroon solid">
                <Td borderRight="1px maroon solid" colSpan={3} rowSpan={5}>
                  <Flex justifyContent="flex-start"></Flex>
                </Td>
                <Td borderRight="1px maroon solid" fontWeight="semibold">
                  Total
                </Td>
                <Td>₹{amount}</Td>
              </Tr>
              <Tr>
                <Td borderRight="1px maroon solid"></Td>
                <Td borderRight="1px maroon solid"></Td>
              </Tr>
              <Tr>
                <Td borderRight="1px maroon solid"></Td>
                <Td borderRight="1px maroon solid"></Td>
              </Tr>
              <Tr>
                <Td borderRight="1px maroon solid" fontWeight="semibold">
                  Grand Total
                </Td>
                <Td borderRight="1px maroon solid">₹{amount}</Td>
              </Tr>
            </Tbody>
          </Table>
          <Flex
            mt="10"
            w="full"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text textAlign="center" color="maroon">
                <i>Thank you!</i>
              </Text>
              <Text textAlign="center">We appreciate your business</Text>
            </Box>
            <Box>
              <Box w="48" h="1px" bg="maroon" />
              <Text textAlign="center">Authorised Sign</Text>
            </Box>
          </Flex>
          <Flex mt="5" pb="5" bg="maroon" flexDir="column" w="full">
            <Text color="white" textAlign="center">
              ADDRESS: 193, Ward DC-2, Near Sonal Dham Temple, Gandhidham.
            </Text>
            <Text color="white" textAlign="center">
              Email: wellcraftindia@gmail.com Mob: +919842 41288
            </Text>
          </Flex>
        </TableContainer>
        <>
          {Array.from({
            length: Math.ceil(currentJobCard?.data?.jobCardEntries?.length / 4),
          }).map((_, idx) => (
            <Flex
              w="640px"
              minH="905px"
              mt="5"
              flexWrap="wrap"
              id={`image-cont-${idx}`}
              key={idx}
            >
              {currentJobCard?.data?.jobCardEntries?.map((card, index) => {
                if (index >= 4 * (idx + 1) || index < 4 * idx) return <></>;
                return (
                  <Flex
                    key={index}
                    minW="300px"
                    height="452px"
                    justifyContent="center"
                    alignItems="center"
                    border="1px solid black"
                    position="relative"
                  >
                    <Image
                      width={300}
                      height={100}
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${card.image}`}
                      alt="image"
                    />
                    <Text position="absolute" bottom="3">
                      {card?.description}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          ))}
        </>
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
        <Heading ml="10">Download invoice</Heading>
      </Flex>
      <Flex my="5" w="full" alignItems="center" justifyContent="space-around">
        <Flex alignItems="center" bg="teal.300" p="2" borderRadius="md">
          Bill by:
          <Select
            w="48"
            mx="5"
            bg="white"
            value={costType}
            onChange={(e) => setCostType(e.target.value)}
          >
            <option value="size">Size</option>
            <option value="time">Time of work</option>
          </Select>
        </Flex>
        <Flex alignItems="center" bg="blue.300" p="2" borderRadius="md">
          <Text w="36">Unit Price:</Text>
          <InputGroup>
            <Input
              ml="3"
              bg="white"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <InputRightElement w="36">
              <Text textAlign="right" color="grey.300" fontWeight="semibold">
                {costType === "size" ? "per sq. feet" : "per hour"}
              </Text>
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Button bg="green.300" onClick={downloadPDF}>
          Download Invoice
        </Button>
      </Flex>
      <Invoice />
    </Box>
  );
};

export default DownloadInvoice;
