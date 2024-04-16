"use client";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Image,
  Tr,
  Center,
} from "@chakra-ui/react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import Link from "next/link";
import AddJobEntryModal from "./AddJobEntryModal";
import ClosedJobCard from "./ClosedJobCard";
import { saveImage } from "../utils";

const Transaction = () => {
  const searchParams = useSearchParams();

  const [masterData, setMasterData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState("");
  const [contractorInfo, setContractorInfo] = useState("");

  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [entryModalData, setEntryModalData] = useState(null);

  const transactionId = searchParams.get("transactionId");

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
  const {
    data: currentTransaction,
    isLoading,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transaction"],
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

  const addTransaction = async () => {
    console.log(customerInfo, contractorInfo);
    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}transaction/new`, {
        customerInfoId: customerInfo,
        contractorInfoId: contractorInfo,
      })
      .then((res) => {
        toast("Transaction started!", { type: "success" });
        window.location.href = `/transaction?transactionId=${res.data._id}`;
      })
      .catch((err) => {
        toast(`Failed to start transaction\n ${err}`, {
          type: "error",
        });
      });
  };

  const deleteJobCardEntry = async (jobCardId, jobCardEntryId) => {
    return axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}jobCards?jobCardId=${jobCardId}&jobCardEntryId=${jobCardEntryId}`
      )
      .then(() => {
        toast("Job Card Entry deleted successfully", { type: "success" });
        refetchTransactions();
      })
      .catch((err) => {
        toast("Job Card Entry deletion failed " + err, { type: "error" });
      });
  };

  const fetchFirstMaster = () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}master`)
      .then((res) => {
        const masterData = res.data;
        setMasterData(res.data);
      });
  };

  const addNewEmptyJobCard = () => {
    return axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}jobCards/empty?transactionId=${transactionId}`
      )
      .then(() => {
        refetchTransactions();
      })
      .catch((err) => {
        toast("Something went wrong " + err, { type: "error" });
      });
  };

  useEffect(() => {
    if (
      transactionId &&
      currentTransaction?.data?.jobCards?.filter(
        (transaction) => transaction.status === "unpaid"
      )?.length === 0
    ) {
      addNewEmptyJobCard();
    }
  }, [currentTransaction, transactionId]);

  useEffect(() => {
    fetchFirstMaster();
  }, []);

  if (isLoading || isLoadingJobCard || !masterData) return <></>;
  return (
    <Box p="10">
      {showAddEntryModal && (
        <AddJobEntryModal
          masterData={masterData}
          onClose={() => setShowAddEntryModal(false)}
          transactionId={transactionId}
          refetchTransactions={refetchTransactions}
          entryModalData={entryModalData}
          deleteJobCardEntry={deleteJobCardEntry}
          currentTransaction={currentTransaction}
        />
      )}
      <Flex>
        <IconButton
          width="10"
          height="10"
          size="sm"
          icon={<ArrowBackOutlinedIcon />}
          aria-label="back-button"
          background="grey.100"
          as="a"
          href="/home"
        />
        <Heading ml="10">
          {transactionId
            ? `Ongoing Transaction: ${transactionId}`
            : "Create new transaction"}
        </Heading>
      </Flex>
      {/* {invoiceId && (
        <Flex mt="5" w="full" justifyContent="space-between">
          <Badge p="1" px="3" borderRadius="lg" background="yellow">
            {invoice?.data.paymentStatus}
          </Badge>
          <Badge p="1" px="3" borderRadius="lg">
            {new Date(invoice?.data.createdAt).toDateString()}
          </Badge>
        </Flex>
      )} */}
      <Flex alignItems="center">
        <Box
          mt="10"
          w="60vw"
          borderRadius="lg"
          shadow="md"
          p="10"
          borderColor="grey.100"
          borderWidth="1px"
        >
          <Flex justifyContent="space-between">
            <Box>
              <Box>
                <Box as="label">Customer name</Box>
                {transactionId ? (
                  <Input
                    height="10"
                    borderLeftRadius="0"
                    type="tel"
                    placeholder="phone number"
                    value={
                      masterData?.customerInfo?.find(
                        (info) =>
                          info._id === currentTransaction?.data.customerInfoId
                      )?.["name"] ?? ""
                    }
                    disabled
                  />
                ) : (
                  <Select
                    onChange={(e) => setCustomerInfo(e.target.value)}
                    value={customerInfo}
                    defaultValue=""
                    placeholder="Select Customer"
                  >
                    {masterData?.customerInfo?.map((info, index) => (
                      <option value={info._id} key={index}>
                        {info.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Box>
              <Box mt="5">
                <Box as="label">Cutomer mobile</Box>
                <InputGroup>
                  <InputLeftAddon>+91</InputLeftAddon>
                  <Input
                    height="10"
                    borderLeftRadius="0"
                    type="tel"
                    placeholder="phone number"
                    value={
                      masterData?.customerInfo?.find(
                        (info) =>
                          info._id ===
                          (transactionId
                            ? currentTransaction?.data.customerInfoId
                            : customerInfo)
                      )?.["phone"] ?? ""
                    }
                    disabled
                  />
                </InputGroup>
              </Box>
            </Box>
            <Box>
              <Box>
                <Box as="label">Contractor name</Box>
                {transactionId ? (
                  <Input
                    height="10"
                    borderLeftRadius="0"
                    value={
                      masterData?.contractorInfo?.find(
                        (info) =>
                          info._id === currentTransaction?.data.contractorInfoId
                      )?.["name"] ?? ""
                    }
                    disabled
                  />
                ) : (
                  <Select
                    onChange={(e) => setContractorInfo(e.target.value)}
                    value={contractorInfo}
                    defaultValue=""
                    placeholder="Select Contractor"
                  >
                    {masterData?.contractorInfo?.map((info, index) => (
                      <option value={info._id} key={index}>
                        {info.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Box>
              <Box mt="5">
                <Box as="label">Contractor mobile</Box>
                <InputGroup>
                  <InputLeftAddon>+91</InputLeftAddon>
                  <Input
                    height="10"
                    borderLeftRadius="0"
                    type="tel"
                    placeholder="phone number"
                    value={
                      masterData?.contractorInfo?.find(
                        (info) =>
                          info._id ===
                          (transactionId
                            ? currentTransaction?.data.contractorInfoId
                            : contractorInfo)
                      )?.["phone"] ?? ""
                    }
                    disabled
                  />
                </InputGroup>
              </Box>
            </Box>
          </Flex>
          <Flex justifyContent="flex-end">
            {!transactionId && (
              <Button mt="5" bg="skyblue" onClick={addTransaction}>
                Create Job Card
              </Button>
            )}
          </Flex>
        </Box>
      </Flex>
      {transactionId &&
        currentTransaction?.data?.jobCards
          ?.filter((jobCard) => jobCard.status === "unpaid")
          ?.map((jobCard, index) => {
            return (
              <TableContainer
                key={index}
                mt="10"
                borderRadius="lg"
                shadow="md"
                p="10"
                pt="5"
                borderColor="grey.100"
                borderWidth="1px"
              >
                <Flex
                  alignItems="center"
                  mb="5"
                  w="full"
                  justifyContent="space-between"
                >
                  <Text fontSize="20" fontWeight="semibold">
                    Job Card
                  </Text>
                  <Text ml="10" textDecoration="underline">
                    Opening Date: {new Date(jobCard?.createdAt).toDateString()}
                  </Text>
                  <Text ml="10" textDecoration="underline">
                    Closing Date: N/A
                  </Text>
                  <Link
                    href={`/download-invoice?transactionId=${transactionId}&jobCardId=${jobCard?._id}`}
                  >
                    <Button bg="green.300">Generate Invoice</Button>
                  </Link>
                </Flex>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th borderWidth="1px" borderColor="gray.200" w="10">
                        Sr. no.
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Description
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Size (mm/inch)
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Quantity
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Machine
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200" w="14">
                        Time of work
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Screenshot
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Ref Image
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Remark
                      </Th>
                      <Th borderWidth="1px" borderColor="gray.200">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {jobCard?.jobCardEntries.map((jobCardEntry, index) => (
                      <Tr key={index}>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Text textAlign="center">{index + 1}</Text>
                        </Td>
                        <Td
                          borderWidth="1px"
                          borderColor="gray.200"
                          maxW="32"
                          overflowX="scroll"
                        >
                          {jobCardEntry.description}
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Flex alignItems="center" justifyContent="center">
                            <Text mr="1">{jobCardEntry.width ?? 0}</Text>
                            {" x "}
                            <Text ml="1">{jobCardEntry.height ?? 0}</Text>
                            <Text ml="1">{jobCardEntry.sizeUnit}</Text>
                          </Flex>
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Text textAlign="center">
                            {jobCardEntry.quantity}
                          </Text>
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Text textAlign="center">
                            {jobCardEntry.machineNumber}
                          </Text>
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Text textAlign="center">
                            {jobCardEntry.timeOfWork} mins
                          </Text>
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${jobCardEntry.image}`}
                            alt="image"
                            width="10"
                          />
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BASE_URL}${jobCardEntry.refImage}`}
                            alt="image"
                            width="10"
                          />
                          <Text
                            color="blue"
                            cursor="pointer"
                            onClick={() =>
                              saveImage(
                                `${process.env.NEXT_PUBLIC_BASE_URL}${jobCardEntry.refImage}`,
                                `${jobCardEntry?.description}-Ref-Image`
                              )
                            }
                          >
                            Download
                          </Text>
                        </Td>
                        <Td
                          borderWidth="1px"
                          borderColor="gray.200"
                          overflowX="scroll"
                        >
                          <Text textAlign="center">{jobCardEntry.remark}</Text>
                        </Td>
                        <Td borderWidth="1px" borderColor="gray.200" minW="20">
                          <Delete
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              deleteJobCardEntry(jobCard._id, jobCardEntry._id)
                            }
                          />
                          <Edit
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                            onClick={() => {
                              setEntryModalData({
                                ...jobCardEntry,
                                jobCardId: jobCard._id,
                                image: jobCardEntry.image,
                                type: "EDIT",
                              });
                              setShowAddEntryModal(true);
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Flex mt="5" justifyContent="flex-end" w="full">
                  <Button
                    bg="teal.300"
                    onClick={() => {
                      setEntryModalData(null);
                      setShowAddEntryModal(true);
                    }}
                  >
                    Add entry
                  </Button>
                  <Link
                    href={`/download-job-card?jobCardId=${
                      currentTransaction?.data?.jobCards?.find(
                        (jobCard) => jobCard.status === "unpaid"
                      )?._id
                    }&transactionId=${transactionId}`}
                  >
                    <Button bg="green.300" ml="3">
                      Generate Job Card PDF
                    </Button>
                  </Link>
                </Flex>
              </TableContainer>
            );
          })}
      {transactionId &&
        currentTransaction?.data?.jobCards
          ?.filter((jobCard) => jobCard.status === "closed")
          .map((jobCard, index) => {
            return (
              <ClosedJobCard
                key={index}
                jobCard={jobCard}
                transactionId={transactionId}
              />
            );
          })}
    </Box>
  );
};

export default Transaction;
