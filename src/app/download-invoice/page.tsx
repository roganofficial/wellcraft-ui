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
  Image as ChakraImage,
} from "@chakra-ui/react";
import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { toast } from "react-toastify";

const Invoice = forwardRef(
  (
    {
      jobCardId,
      masterData,
      transaction,
      currentJobCard,
      costType,
      getTotalMeasurment,
      getTotalQuantity,
      unitPrice,
      setUnitPrice,
      getTotalAmount,
    },
    ref
  ) => {
    const fetchInvoiceByJobCardId = async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction/invoice?jobCardId=${jobCardId}`
      );
      return result.data;
    };
    const { data: invoiceData, isLoading: isLoadingInvoiceData } = useQuery({
      queryKey: ["fetch-invoice"],
      queryFn: fetchInvoiceByJobCardId,
    });

    useEffect(() => {
      if (invoiceData) {
        setUnitPrice(invoiceData?.[0]?.unitPrice);
      } else {
        console.log("indata", costType);
        if (costType === "size") {
          setUnitPrice(new Array(100).fill(masterData?.pricePerSqFeet));
        } else {
          setUnitPrice(new Array(100).fill(masterData?.pricePerHour));
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceData, costType, masterData]);

    if (isLoadingInvoiceData) return <></>;

    return (
      <Box borderWidth="1px" borderColor="black" p="5" ref={ref} maxW="740px">
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
            <Text mt="2" fontSize="16">
              <Box as="span" fontWeight="semibold" mr="0">
                C/O :
              </Box>
              <Box as="span" ml="3" textDecoration="underline" minW="48">
                {
                  masterData?.contractorInfo?.find(
                    (info) => info._id === transaction?.data?.contractorInfoId
                  )?.name
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
                  Size
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
              {currentJobCard?.data.jobCardEntries?.map(
                (jobCardEntry, index) => {
                  const quantity =
                    costType === "size"
                      ? getTotalMeasurment(jobCardEntry)
                      : getTotalQuantity();
                  const amount = (quantity * unitPrice?.[index]).toFixed(2);
                  return (
                    <Tr key={index}>
                      <Td
                        borderRight="1px maroon solid"
                        px="0"
                        textAlign="center"
                      >
                        {index + 1}
                      </Td>
                      <Td borderRight="1px maroon solid" pr="1">
                        {jobCardEntry.description}
                      </Td>
                      <Td borderRight="1px maroon solid" px="1">
                        {jobCardEntry?.width} x {jobCardEntry?.height}{" "}
                        {jobCardEntry?.sizeUnit}
                      </Td>
                      <Td
                        borderRight="1px maroon solid"
                        px="0"
                        textAlign="center"
                      >
                        {quantity}
                      </Td>
                      <Td
                        borderRight="1px maroon solid"
                        p="0"
                        textAlign="center"
                      >
                        <Input
                          type="number"
                          value={unitPrice?.[index]}
                          onChange={(e) =>
                            setUnitPrice([
                              ...unitPrice.slice(0, index),
                              e.target.value,
                              ...unitPrice.slice(index + 1),
                            ])
                          }
                          border="none"
                          w="20"
                        />
                      </Td>
                      <Td
                        borderRight="1px maroon solid"
                        px="2"
                        textAlign="center"
                      >
                        ₹{amount}
                      </Td>
                    </Tr>
                  );
                }
              )}
              {Array.from({
                length: 11 - currentJobCard?.data.jobCardEntries?.length,
              }).map((_, index) => (
                <Tr key={index}>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                </Tr>
              ))}
              <Tr borderRight="1px maroon solid">
                <Td borderRight="1px maroon solid" colSpan={4} rowSpan={5}>
                  <Flex justifyContent="flex-start"></Flex>
                </Td>
                <Td
                  borderRight="1px maroon solid"
                  fontWeight="semibold"
                  textAlign="center"
                >
                  Total
                </Td>
                <Td borderRight="1px maroon solid">₹{getTotalAmount()}</Td>
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
                <Td borderRight="1px maroon solid" fontWeight="semibold" px="0">
                  Grand Total
                </Td>
                <Td borderRight="1px maroon solid">₹{getTotalAmount()}</Td>
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
        <div id="my_mm" style={{ height: "100mm", display: "none" }}></div>
        <>
          {Array.from({
            length: Math.ceil(currentJobCard?.data?.jobCardEntries?.length / 4),
          }).map((_, idx) => (
            <Flex
              w="740px"
              minH="1018px"
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
                    minW="340px"
                    height="509px"
                    justifyContent="center"
                    alignItems="center"
                    border="1px solid black"
                    position="relative"
                  >
                    <ChakraImage
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${card.image}`}
                      width={300}
                      style={{
                        height: "auto",
                      }}
                      alt={`${card.image}`}
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
  }
);

Invoice.displayName = "Invoice";

const DownloadInvoice = () => {
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId");
  const jobCardId = searchParams.get("jobCardId");
  //   const costType = searchParams.get("costType") ?? "size";
  const componentRef = useRef(null);
  const [costType, setCostType] = useState("size");
  const [masterData, setMasterData] = useState(null);
  const [unitPrice, setUnitPrice] = useState(new Array(100).fill(0));

  const fetchFirstMaster = () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}master`)
      .then((res) => {
        const masterData = res.data;
        setMasterData(res.data);
      });
  };

  const downloadPDF = async () => {
    generateInvoice();
    const canvas = await html2canvas(componentRef.current, {
      height: 1920,
      width: 1080,
    });

    const imgData = canvas.toDataURL("image/png");
    const numOfImgPages = Math.ceil(
      currentJobCard?.data?.jobCardEntries?.length / 4
    );
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

  // const generateInvoiceId = () =>{
  //   return `${lastInvoiceNo}${new Date().getMonth().toFixed(2)}${new Date().getFullYear()}`
  // }

  useEffect(() => {
    fetchFirstMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (costType === "size") {
      setUnitPrice(new Array(100).fill(masterData?.pricePerSqFeet));
    } else {
      setUnitPrice(new Array(100).fill(masterData?.pricePerHour));
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

  const getTotalMeasurment = (data) => {
    let result = 0;
    const totalArea =
      Number(data?.height) * Number(data?.width) * Number(data?.quantity);
    const sqFeetArea = totalArea / (data?.sizeUnit === "mm" ? 92900 : 144);
    result += sqFeetArea;
    return result.toFixed(2);
  };

  const totalTimeOfWork =
    jobCards?.data
      ?.map((e) => Number(e.timeOfWork))
      .reduce((a, b) => a + b, 0) / 60;

  // const amount = (
  //   costType === "size"
  //     ? getTotalMeasurment() * unitPrice
  //     : (totalTimeOfWork * unitPrice).toFixed(2)
  // ).toLocaleString();
  const getTotalAmount = () => {
    return currentJobCard?.data?.jobCardEntries
      ?.map((jobCardEntry, index) => {
        const quantity =
          costType === "size"
            ? getTotalMeasurment(jobCardEntry)
            : getTotalQuantity();
        const amount = quantity * unitPrice?.[index];
        return amount;
      })
      ?.reduce((a, b) => a + b, 0)
      .toFixed(2);
  };

  const generateInvoice = () => {
    return axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction/invoice/new?transactionId=${transactionId}&jobCardId=${jobCardId}`,
        {
          costType,
          unitPrice,
        }
      )
      .then(() => toast("Invoice saved successfully", { type: "success" }))
      .catch((err) => toast("Failed to save invoice", { type: "error" }));
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
        {/* <Flex alignItems="center" bg="blue.300" p="2" borderRadius="md">
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
        </Flex> */}
        <Button bg="green.300" onClick={downloadPDF}>
          Download Invoice
        </Button>
      </Flex>
      <Invoice
        ref={componentRef}
        jobCardId={jobCardId}
        masterData={masterData}
        transaction={transaction}
        currentJobCard={currentJobCard}
        costType={costType}
        getTotalMeasurment={getTotalMeasurment}
        getTotalQuantity={getTotalQuantity}
        unitPrice={unitPrice}
        setUnitPrice={setUnitPrice}
        getTotalAmount={getTotalAmount}
      />
    </Box>
  );
};

export default DownloadInvoice;
