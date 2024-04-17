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
      totalAmount,
      otherCharges1,
      setOtherCharges1,
      otherCharges2,
      setOtherCharges2,
      otherCharges3,
      setOtherCharges3,
      grandTotal,
      setCostType,
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
      if (costType === "time") {
        const prevUnitPrice = new Array(100).fill(masterData?.pricePerHour);
        const newUnitPrices = prevUnitPrice.map((price, index) => {
          if (invoiceData?.[0]?.unitPrice?.[index]) {
            return invoiceData?.[0]?.unitPrice?.[index];
          }
          return Math.round(
            (price / 60) *
              currentJobCard?.data?.jobCardEntries?.[index]?.timeOfWork
          );
        });
        setUnitPrice([...newUnitPrices]);
      } else {
        setUnitPrice(new Array(100).fill(masterData?.pricePerSqFeet));
      }
    }, [costType, masterData, currentJobCard, invoiceData]);

    useEffect(() => {
      setCostType(invoiceData?.[0]?.costType);
      if (invoiceData?.[0]?.otherCharges?.length > 0) {
        const otherCharges = invoiceData?.[0]?.otherCharges;
        if (otherCharges[0]?.field) console.log(otherCharges[0]?.field);
        setOtherCharges1((prevValue) => {
          return { ...prevValue, field: otherCharges?.[0]?.field ?? "" };
        });
        if (otherCharges[0]?.value)
          setOtherCharges1((prevValue) => {
            return { ...prevValue, value: otherCharges?.[0]?.value ?? "" };
          });
        if (otherCharges[1]?.field)
          setOtherCharges2((prevValue) => {
            return { ...prevValue, field: otherCharges?.[1]?.field ?? "" };
          });
        if (otherCharges[1]?.value)
          setOtherCharges2((prevValue) => {
            return { ...prevValue, value: otherCharges?.[1]?.value ?? "" };
          });
        if (otherCharges[2]?.field)
          setOtherCharges3((prevValue) => {
            return { ...prevValue, field: otherCharges?.[2]?.field ?? "" };
          });
        if (otherCharges[2]?.value)
          setOtherCharges3((prevValue) => {
            return { ...prevValue, value: otherCharges?.[2]?.value ?? "" };
          });
      }
    }, [invoiceData]);

    if (isLoadingInvoiceData) return <></>;

    return (
      <Box p="5" ref={ref} maxW="780px">
        <Flex justifyContent="space-between" alignItems="center" mt="5">
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
        <Flex justifyContent="space-between" alignItems="center" mt="5">
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
        <Flex></Flex>
        <TableContainer mt="5">
          <Table variant="simple" border="1px solid maroon">
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
                {costType === "size" && (
                  <Th color="white" px="0" textAlign="center">
                    Qty(sq. ft)
                  </Th>
                )}
                <Th color="white" px="0" textAlign="center" w="32">
                  Unit Price
                </Th>
                <Th color="white" px="0" textAlign="center" w="32">
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
                      : getTotalQuantity(jobCardEntry);
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
                        {jobCardEntry?.quantity}
                      </Td>
                      {costType === "size" && (
                        <Td
                          borderRight="1px maroon solid"
                          px="0"
                          textAlign="center"
                        >
                          {quantity}
                        </Td>
                      )}
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
                length: 12 - currentJobCard?.data.jobCardEntries?.length,
              }).map((_, index) => (
                <Tr key={index}>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  <Td borderRight="1px maroon solid"></Td>
                  {costType === "size" && (
                    <Td borderRight="1px maroon solid"></Td>
                  )}
                </Tr>
              ))}
              <Tr>
                <Td
                  borderBottom="1px maroon solid !important"
                  borderRight="1px maroon solid"
                ></Td>
                <Td
                  borderBottom="1px maroon solid !important"
                  borderRight="1px maroon solid"
                ></Td>
                <Td
                  borderBottom="1px maroon solid !important"
                  borderRight="1px maroon solid"
                ></Td>
                <Td
                  borderBottom="1px maroon solid !important"
                  borderRight="1px maroon solid"
                ></Td>
                <Td
                  borderBottom="1px maroon solid !important"
                  borderRight="1px maroon solid"
                ></Td>
                <Td
                  borderBottom="1px maroon solid !important"
                  borderRight="1px maroon solid"
                ></Td>
                {costType === "size" && (
                  <Td
                    borderBottom="1px maroon solid !important"
                    borderRight="1px maroon solid"
                  ></Td>
                )}
              </Tr>
              <Tr borderRight="1px maroon solid">
                <Td
                  borderRight="1px maroon solid"
                  colSpan={costType === "size" ? 5 : 4}
                  rowSpan={5}
                >
                  <Flex justifyContent="flex-start"></Flex>
                </Td>
                <Td
                  borderRight="1px maroon solid"
                  fontWeight="semibold"
                  textAlign="center"
                >
                  Total
                </Td>
                <Td borderRight="1px maroon solid" textAlign="center">
                  ₹{totalAmount}
                </Td>
              </Tr>
              <Tr>
                <Td p="0" borderRight="1px maroon solid">
                  <Input
                    w="full"
                    value={otherCharges1?.["field"]}
                    onChange={(e) =>
                      setOtherCharges1((prevValue) => {
                        return { ...prevValue, field: e.target.value };
                      })
                    }
                    px="0"
                    border="none"
                    fontWeight="semibold"
                    textAlign="center"
                  />
                </Td>
                <Td p="0" borderRight="1px maroon solid">
                  <Input
                    type="number"
                    value={otherCharges1?.["value"]}
                    onChange={(e) =>
                      setOtherCharges1((prevValue) => {
                        return { ...prevValue, value: e.target.value };
                      })
                    }
                    border="none"
                    w="full"
                    p="0"
                    textAlign="center"
                  />
                </Td>
              </Tr>
              <Tr>
                <Td p="0" borderRight="1px maroon solid">
                  <Input
                    value={otherCharges2?.["field"]}
                    onChange={(e) =>
                      setOtherCharges2((prevValue) => {
                        return { ...prevValue, field: e.target.value };
                      })
                    }
                    border="none"
                    w="full"
                    fontWeight="semibold"
                    p="0"
                    textAlign="center"
                  />
                </Td>
                <Td p="0" borderRight="1px maroon solid">
                  <Input
                    type="number"
                    value={otherCharges2?.["value"]}
                    onChange={(e) =>
                      setOtherCharges2((prevValue) => {
                        return { ...prevValue, value: e.target.value };
                      })
                    }
                    border="none"
                    w="full"
                    p="0"
                    textAlign="center"
                  />
                </Td>
              </Tr>
              <Tr>
                <Td p="0" borderRight="1px maroon solid">
                  <Input
                    value={otherCharges3?.["field"]}
                    onChange={(e) =>
                      setOtherCharges3((prevValue) => {
                        return { ...prevValue, field: e.target.value };
                      })
                    }
                    border="none"
                    w="full"
                    fontWeight="semibold"
                    p="0"
                    textAlign="center"
                  />
                </Td>
                <Td p="0" borderRight="1px maroon solid">
                  <Input
                    type="number"
                    value={otherCharges3?.["value"]}
                    onChange={(e) =>
                      setOtherCharges3((prevValue) => {
                        return { ...prevValue, value: e.target.value };
                      })
                    }
                    border="none"
                    w="full"
                    p="0"
                    textAlign="center"
                  />
                </Td>
              </Tr>
              <Tr>
                <Td
                  borderRight="1px maroon solid"
                  fontWeight="semibold"
                  px="0"
                  textAlign="center"
                >
                  Grand Total
                </Td>
                <Td borderRight="1px maroon solid" textAlign="center">
                  ₹{grandTotal}
                </Td>
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
          <Flex mt="5" pb="7" bg="maroon" flexDir="column" w="full">
            <Text color="white" textAlign="center">
              ADDRESS: 193, Ward DC-2, Near Sonal Dham Temple, Gandhidham.
            </Text>
            <Text color="white" textAlign="center">
              Email: wellcraftindia@gmail.com Mob: +919842 41288
            </Text>
          </Flex>
        </TableContainer>
        <Box pt="5">
          {Array.from({
            length: Math.ceil(currentJobCard?.data?.jobCardEntries?.length / 4),
          }).map((_, idx) => (
            <Flex
              w="780px"
              minH="1102px"
              mt="5"
              justifyContent="center"
              flexWrap="wrap"
              id={`image-cont-${idx}`}
              key={idx}
            >
              {currentJobCard?.data?.jobCardEntries?.map((card, index) => {
                if (index >= 4 * (idx + 1) || index < 4 * idx) return <></>;
                return (
                  <Flex
                    key={index}
                    minW="365px"
                    height="551px"
                    justifyContent="center"
                    alignItems="center"
                    border="1px solid black"
                    position="relative"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${card.image}`}
                      width={300}
                      height={500}
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
        </Box>
      </Box>
    );
  }
);

Invoice.displayName = "Invoice";

const DownloadInvoice = () => {
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId");
  const jobCardId = searchParams.get("jobCardId");
  const componentRef = useRef(null);
  const [costType, setCostType] = useState("time");
  const [unitPrice, setUnitPrice] = useState(new Array(100).fill(0));
  const [otherCharges1, setOtherCharges1] = useState({ field: "", value: "" });
  const [otherCharges2, setOtherCharges2] = useState({ field: "", value: "" });
  const [otherCharges3, setOtherCharges3] = useState({ field: "", value: "" });
  const [grandTotal, setGrandTotal] = useState({
    totalAmount: 0,
    grandTotal: 0,
  });

  const fetchFirstMaster = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}master`
      );
      return response.data;
    } catch (err) {}
  };

  const { data: masterData, isLoading: isLoadingMasterData } = useQuery({
    queryKey: ["master-data"],
    queryFn: fetchFirstMaster,
  });

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

  const generateInvoice = () => {
    return axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction/invoice/new?transactionId=${transactionId}&jobCardId=${jobCardId}`,
        {
          costType,
          unitPrice: unitPrice.map((e) => Number(e)).filter((e) => !!e),
          otherCharges: [otherCharges1, otherCharges2, otherCharges3],
        }
      )
      .then(() => toast("Invoice saved successfully", { type: "success" }))
      .catch((err) => toast("Failed to save invoice", { type: "error" }));
  };

  const getTotalAmount = () => {
    let totalAmount = currentJobCard?.data?.jobCardEntries
      ?.map((jobCardEntry, index) => {
        const quantity =
          costType === "size"
            ? getTotalMeasurment(jobCardEntry)
            : getTotalQuantity(jobCardEntry);
        const amount = quantity * unitPrice?.[index];
        return amount;
      })
      ?.reduce((a, b) => a + b, 0);
    const extraCharges =
      (Number(otherCharges1?.value) ?? 0) +
      (Number(otherCharges2?.value) ?? 0) +
      (Number(otherCharges3?.value) ?? 0);
    return { totalAmount, grandTotal: totalAmount + extraCharges };
  };

  const getTotalQuantity = (jobCardEntry) => {
    return Number(jobCardEntry?.quantity) ?? 0;
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

  useEffect(() => {
    fetchFirstMaster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setGrandTotal(getTotalAmount());
  }, [
    otherCharges1,
    otherCharges2,
    otherCharges3,
    costType,
    currentJobCard,
    masterData,
    getTotalAmount,
  ]);

  if (
    isLoading ||
    isLoadingJobCard ||
    isCurrentJobCardLoading ||
    isLoadingMasterData
  )
    return <></>;

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
            <option value="time">Time of work</option>
            <option value="size">Size</option>
          </Select>
        </Flex>
        <Button bg="green.300" onClick={generateInvoice}>
          Save Changes
        </Button>
        <Button bg="red.300" onClick={downloadPDF}>
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
        totalAmount={grandTotal.totalAmount}
        grandTotal={grandTotal.grandTotal}
        otherCharges1={otherCharges1}
        setOtherCharges1={setOtherCharges1}
        otherCharges2={otherCharges2}
        setOtherCharges2={setOtherCharges2}
        otherCharges3={otherCharges3}
        setOtherCharges3={setOtherCharges3}
        setCostType={setCostType}
      />
    </Box>
  );
};

export default DownloadInvoice;
