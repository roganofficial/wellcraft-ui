"use client";
import {
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Image,
  Tr,
  Box,
  Select,
  Input,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ClosedJobCard = ({ jobCard, transactionId }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [status, setStatus] = useState("unpaid");
  const fetchInvoiceByJobCardId = async () => {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}transaction/invoice?jobCardId=${jobCard._id}`
    );
    return result.data;
  };

  const {
    data: invoiceData,
    isLoading: isLoadingInvoiceData,
    refetch: refetchInvoice,
  } = useQuery({
    queryKey: [`fetch-invoice-${jobCard._id}`],
    queryFn: fetchInvoiceByJobCardId,
  });

  const updatePaymentInfo = () => {
    return axios
      .put(
        `${process.env.NEXT_PUBLIC_BASE_URL}transaction/invoice/payment?invoiceId=${invoiceData?.[0]?._id}`,
        {
          paymentAmount:
            Number(paymentAmount) + Number(invoiceData?.[0]?.paymentAmount) ??
            0,
          status,
        }
      )
      .then(() => {
        toast("Payment updated successfully", { type: "success" });
        refetchInvoice();
      })
      .catch(() => toast("Payment update failed", { type: "error" }));
  };

  const getTotalAmount = () => {
    const otherCharges =
      invoiceData?.[0]?.otherCharges.length > 0
        ? invoiceData?.[0]?.otherCharges?.reduce(
            (a, b) => a + Number(b.value),
            0
          )
        : 0;
    const primaryAmountMap = jobCard?.jobCardEntries?.map(
      (jobCardEntry, index) => {
        const quantity =
          costType === "size"
            ? getTotalMeasurment(jobCardEntry)
            : getTotalQuantity(jobCardEntry);
        const unitPrice = invoiceData?.[0]?.unitPrice[index];
        const amount = quantity * unitPrice;
        return amount;
      }
    );
    const totalPrimaryAmount = primaryAmountMap.reduce((a, b) => a + b, 0);
    return otherCharges + totalPrimaryAmount;
  };

  if (isLoadingInvoiceData) return <></>;

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

  const costType = invoiceData?.[0]?.costType;

  return (
    <TableContainer
      mt="10"
      borderRadius="lg"
      shadow="md"
      p="10"
      pt="5"
      borderColor="grey.100"
      borderWidth="1px"
      bg="gray.100"
    >
      <Flex alignItems="center" w="full" justifyContent="space-between">
        <Text fontSize="20" fontWeight="semibold">
          Closed Job Card{" "}
          <Box as="span" fontSize="16" fontWeight="normal">
            (Invoice preview)
          </Box>
        </Text>
        <Text ml="10" textDecoration="underline">
          Opening Date: {new Date(jobCard?.createdAt).toDateString()}
        </Text>
        <Text ml="10" textDecoration="underline">
          Closing Date: {new Date(jobCard?.closedOn).toDateString()}
        </Text>
        <Link
          href={`/download-invoice?transactionId=${transactionId}&jobCardId=${jobCard._id}`}
        >
          <Button bg="green.300">View Invoice</Button>
        </Link>
      </Flex>
      <Table variant="simple" bg="teal.300">
        <Thead>
          <Tr>
            <Th borderWidth="1px" borderColor="gray.200" w="10">
              Billed By
            </Th>
            <Th borderWidth="1px" borderColor="gray.200" w="10">
              Total Amount
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Paid Amount
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Remaining Amount
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Payment Status
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Amount Paying
            </Th>
            <Th borderWidth="1px" borderColor="gray.200"></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td borderWidth="1px" borderColor="gray.200">
              <Text textAlign="center">{invoiceData?.[0]?.costType}</Text>
            </Td>
            <Td borderWidth="1px" borderColor="gray.200">
              <Text textAlign="center">₹{getTotalAmount()}</Text>
            </Td>
            <Td borderWidth="1px" borderColor="gray.200">
              <Text textAlign="center">₹{invoiceData?.[0]?.paymentAmount}</Text>
            </Td>
            <Td borderWidth="1px" borderColor="gray.200">
              <Text textAlign="center">
                ₹{getTotalAmount() - Number(invoiceData?.[0]?.paymentAmount)}
              </Text>
            </Td>
            <Td borderWidth="1px" borderColor="gray.200">
              <Text textAlign="center">
                {getTotalAmount() - Number(invoiceData?.[0]?.paymentAmount) ===
                getTotalAmount()
                  ? "Unpaid"
                  : getTotalAmount() - Number(invoiceData?.[0]?.paymentAmount) >
                    0
                  ? "Partially paid"
                  : "Paid"}
              </Text>
            </Td>
            <Td borderWidth="1px" borderColor="gray.200">
              <Input
                ml="5"
                bg="white"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Invoice amount"
                w="32"
              />
            </Td>
            <Td borderWidth="1px" borderColor="gray.200">
              <Button bg="gray.500" onClick={updatePaymentInfo}>
                Save
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      {/* <Flex
        alignItems="center"
        bg="teal.300"
        px="5"
        my="5"
        py="1"
        borderRadius="lg"
        justifyContent="space-between"
      >
        <Text>
          Cost By :
          <Box as="span" fontWeight="semibold">
            {" "}
            {costType}
          </Box>
        </Text>
        <Flex ml="10" alignItems="center">
          <Text fontWeight="semibold">Total Amount :</Text>
          <Text fontWeight="semibold">Paid Amount :</Text>
          <Text>Payment Status :</Text>
          <Select
            ml="5"
            bg="white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </Select>
          <>
            <Text ml="10">Amount : </Text>
            <Input
              ml="5"
              bg="white"
              value={status === "paid" ? paymentAmount : 0}
              isDisabled={status === "unpaid"}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Invoice amount"
            />
          </>
        </Flex>
        <Button bg="gray.500" onClick={updatePaymentInfo}>
          Save
        </Button>
      </Flex> */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th borderWidth="1px" borderColor="gray.200" w="10">
              Item No
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Description
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Size
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Quantity
            </Th>
            <Th borderWidth="1px" borderColor="gray.200">
              Unit Price
            </Th>
            <Th borderWidth="1px" borderColor="gray.200" w="14">
              Amount
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {jobCard?.jobCardEntries.map((jobCard, index) => {
            const quantity =
              costType === "size"
                ? getTotalMeasurment(jobCard)
                : getTotalQuantity(jobCard);
            const unitPrice = invoiceData?.[0]?.unitPrice[index];
            const amount = (quantity * unitPrice).toFixed(2);
            return (
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
                  {jobCard.description}
                </Td>
                <Td borderWidth="1px" borderColor="gray.200">
                  <Flex alignItems="center" justifyContent="center">
                    <Text mr="1">{jobCard.width ?? 0}</Text>
                    {" x "}
                    <Text ml="1">{jobCard.height ?? 0}</Text>
                    <Text ml="1">{jobCard.sizeUnit}</Text>
                  </Flex>
                </Td>
                <Td borderWidth="1px" borderColor="gray.200">
                  <Text textAlign="center">{quantity}</Text>
                </Td>
                <Td borderWidth="1px" borderColor="gray.200">
                  <Text textAlign="center">
                    {invoiceData?.[0]?.unitPrice?.[index]}
                  </Text>
                </Td>
                <Td borderWidth="1px" borderColor="gray.200">
                  <Text textAlign="center">₹{amount}</Text>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ClosedJobCard;
