"use client";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
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
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { Check, Delete } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

const MasterPanel = () => {
  const [customerInfo, setCustomerInfo] = useState([]);
  const [contractorInfo, setContractorInfo] = useState([]);
  const [materials, setMaterials] = useState();
  const [cncMachines, setCncMachines] = useState();
  const [thickness, setThickness] = useState();
  const [typeOfWork, setTypeOfWork] = useState();
  const [pricePerHour, setPricePerHour] = useState();
  const [pricePerSqFeet, setPricePerSqFeet] = useState();
  const [customerName, setCustomerName] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [contractorName, setContractorName] = useState();
  const [contractorPhone, setContractorPhone] = useState();
  const [masterId, setMasterId] = useState(null);

  const handleTextAreaChange = (text, setter) => {
    const values = text.split(",").map((value) => value.trim());
    setter(values);
  };

  const addInfo = (info, setter) => {
    setter((prevValue) => [...prevValue, info]);
    setCustomerName("");
    setCustomerPhone("");
    setContractorName("");
    setContractorPhone("");
  };

  const deleteInfo = (index, setter) => {
    setter((prevValue) => prevValue.filter((_, idx) => idx !== index));
  };

  const fetchFirstMaster = () => {
    return axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}master`)
      .then((res) => {
        const masterData = res.data;
        setMasterId(masterData._id);
        setCustomerInfo(masterData.customerInfo);
        setContractorInfo(masterData.contractorInfo);
        setMaterials(masterData.materials);
        setCncMachines(masterData.cncMachines);
        setThickness(masterData.thickness);
        setTypeOfWork(masterData.typeOfWork);
        setPricePerHour(masterData.pricePerHour);
        setPricePerSqFeet(masterData.pricePerSqFeet);
      });
  };

  const upsertMasterTable = () => {
    if (!masterId) {
      return axios
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}master`, {
          customerInfo,
          contractorInfo,
          materials,
          cncMachines,
          thickness,
          typeOfWork,
          pricePerHour,
          pricePerSqFeet,
        })
        .then((res) =>
          toast("Master created successfully", { type: "success" })
        )
        .catch((err) => console.log(err));
    } else {
      return axios
        .put(`${process.env.NEXT_PUBLIC_BASE_URL}master/${masterId}`, {
          customerInfo,
          contractorInfo,
          materials,
          cncMachines,
          thickness,
          typeOfWork,
          pricePerHour,
          pricePerSqFeet,
        })
        .then((res) =>
          toast("Master updated successfully", { type: "success" })
        )
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchFirstMaster();
  }, []);

  return (
    <Box>
      <Box p="10">
        <Flex alignItems="center">
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
          <Heading ml="10">Master Panel</Heading>
        </Flex>
        <Flex w="full" justifyContent="space-around" mt="5">
          <TableContainer maxH="96" overflowY="scroll">
            <Text textAlign="center" fontWeight="bold">
              Customer Info
            </Text>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Customer Name</Th>
                  <Th>Customer Phone</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {customerInfo?.map((info, index) => (
                  <Tr key={index}>
                    <Td>{info?.name}</Td>
                    <Td>{info?.phone}</Td>
                    <Td>
                      <Flex w="20" justifyContent="space-between">
                        <IconButton
                          width="5"
                          height="5"
                          size="sm"
                          icon={<Delete />}
                          aria-label="back-button"
                          background="grey.100"
                          onClick={() => deleteInfo(index, setCustomerInfo)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td>
                    <Input
                      w="48"
                      placeholder="Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      bg="white"
                    />
                  </Td>
                  <Td>
                    <Input
                      w="48"
                      placeholder="Phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      bg="white"
                    />
                  </Td>
                  <Td>
                    <Flex w="20" justifyContent="center">
                      <IconButton
                        width="5"
                        height="5"
                        size="sm"
                        icon={<Check />}
                        aria-label="back-button"
                        background="grey.100"
                        onClick={() =>
                          addInfo(
                            { name: customerName, phone: customerPhone },
                            setCustomerInfo
                          )
                        }
                      />
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <TableContainer maxH="96" overflowY="scroll">
            <Text textAlign="center" fontWeight="bold">
              Contractor Info
            </Text>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Contractor Name</Th>
                  <Th>Contractor Phone</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {contractorInfo?.map((info, index) => (
                  <Tr key={index}>
                    <Td>{info?.name}</Td>
                    <Td>{info?.phone}</Td>
                    <Td>
                      <Flex w="20" justifyContent="space-between">
                        <IconButton
                          width="5"
                          height="5"
                          size="sm"
                          icon={<Delete />}
                          aria-label="back-button"
                          background="grey.100"
                          onClick={() => deleteInfo(index, setContractorInfo)}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td>
                    <Input
                      w="48"
                      placeholder="Name"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      bg="white"
                    />
                  </Td>
                  <Td>
                    <Input
                      w="48"
                      placeholder="Phone"
                      value={contractorPhone}
                      onChange={(e) => setContractorPhone(e.target.value)}
                      bg="white"
                    />
                  </Td>
                  <Td>
                    <Flex w="20" justifyContent="center">
                      <IconButton
                        width="5"
                        height="5"
                        size="sm"
                        icon={<Check />}
                        aria-label="back-button"
                        background="grey.100"
                        onClick={() =>
                          addInfo(
                            { name: contractorName, phone: contractorPhone },
                            setContractorInfo
                          )
                        }
                      />
                    </Flex>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
        <Box mt="5" px="10">
          <Text>
            <Box as="span" fontWeight="bold">
              Material Names
            </Box>
            (Enter the values comma separated)
          </Text>
          <Textarea
            value={materials?.join(",")}
            onChange={(e) => handleTextAreaChange(e.target.value, setMaterials)}
            mt="2"
            placeholder="Enter Material names"
          />
        </Box>
        <Box mt="5" px="10">
          <Text>
            <Box as="span" fontWeight="bold">
              CNC Machines
            </Box>
            (Enter the values comma separated)
          </Text>
          <Textarea
            value={cncMachines?.join(",")}
            onChange={(e) =>
              handleTextAreaChange(e.target.value, setCncMachines)
            }
            mt="2"
            placeholder="Enter CNC machines names"
          />
        </Box>
        <Box mt="5" px="10">
          <Text>
            <Box as="span" fontWeight="bold">
              Thickness
            </Box>
            (Enter the values comma separated)
          </Text>
          <Textarea
            value={thickness?.join(",")}
            onChange={(e) => handleTextAreaChange(e.target.value, setThickness)}
            mt="2"
            placeholder="Enter Thickness values"
          />
        </Box>
        <Box mt="5" px="10">
          <Text>
            <Box as="span" fontWeight="bold">
              Type of Work
            </Box>
            (Enter the values comma separated)
          </Text>
          <Textarea
            value={typeOfWork?.join(",")}
            onChange={(e) =>
              handleTextAreaChange(e.target.value, setTypeOfWork)
            }
            mt="2"
            placeholder="Enter Type of works"
          />
        </Box>
        <Flex mt="5" px="10">
          <Flex alignItems="center" mt="3">
            Price per hour{" "}
            <Input
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              ml="5"
              w="48"
            />
          </Flex>
          <Flex alignItems="center" mt="3" ml="5">
            Price per sq. feet{" "}
            <Input
              ml="5"
              w="48"
              value={pricePerSqFeet}
              onChange={(e) => setPricePerSqFeet(e.target.value)}
            />
          </Flex>
        </Flex>
      </Box>
      <Flex
        bg="teal"
        w="full"
        position="sticky"
        bottom="0"
        h="20"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button bg="skyblue" mr="20" onClick={upsertMasterTable}>
          Save Changes
        </Button>
      </Flex>
    </Box>
  );
};

export default MasterPanel;
