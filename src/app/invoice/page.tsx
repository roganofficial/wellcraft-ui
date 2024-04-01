import {
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
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

const page = () => {
  return (
    <Box p="10">
      <Flex>
        <IconButton
          width="10"
          height="10"
          size="sm"
          icon={<ArrowBackOutlinedIcon />}
          aria-label="back-button"
          background="grey.100"
        />
        <Heading ml="10">Create new invoice</Heading>
      </Flex>
      <Flex
        mt="10"
        w="60vw"
        justifyContent="space-between"
        borderRadius="lg"
        shadow="md"
        p="10"
        borderColor="grey.100"
        borderWidth="1px"
      >
        <Box>
          <Box>
            <Box as="label">Customer name</Box>
            <InputGroup>
              <InputLeftAddon>+91</InputLeftAddon>
              <Input
                height="10"
                borderLeftRadius="0"
                type="tel"
                placeholder="phone number"
              />
            </InputGroup>
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
              />
            </InputGroup>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box as="label">Contractor name</Box>
            <InputGroup>
              <InputLeftAddon>+91</InputLeftAddon>
              <Input
                height="10"
                borderLeftRadius="0"
                type="tel"
                placeholder="phone number"
              />
            </InputGroup>
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
              />
            </InputGroup>
          </Box>
        </Box>
      </Flex>
      <TableContainer
        mt="10"
        borderRadius="lg"
        shadow="md"
        p="10"
        borderColor="grey.100"
        borderWidth="1px"
      >
        <Table variant="simple">
          <TableCaption>
            All the job cards will be in a single invoice
          </TableCaption>
          <Thead>
            <Tr>
              <Th w="10">Sr. no.</Th>
              <Th>Description</Th>
              <Th>Size (mm/inch)</Th>
              <Th>Quantity</Th>
              <Th>Machine</Th>
              <Th w="14">Time of work</Th>
              <Th>Upload Screenshot</Th>
              <Th>Remark</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Input placeholder="Sr. no." />
              </Td>
              <Td>
                <Textarea placeholder="Description" />
              </Td>
              <Td>
                <Flex alignItems="center">
                  <Input placeholder="Height" mr="3" />
                  {" X "}
                  <Input placeholder="Width" ml="3" />
                  <Select placeholder="Select unit" size="xs" ml="3">
                    <option value="option1">mm</option>
                    <option value="option2">inch</option>
                  </Select>
                </Flex>
              </Td>
              <Td>
                <Input placeholder="Quantity" type="number" />
              </Td>
              <Td>
                <Select placeholder="Machine" minW="max-content">
                  <option value="option1">CNC 1</option>
                  <option value="option2">CNC 2</option>
                </Select>
              </Td>
              <Td>
                <Input placeholder="In mins" />
              </Td>
              <Td>
                <Button bg="black" color="white">
                  Upload
                </Button>
              </Td>
              <Td>
                <Textarea placeholder="Remark" />
              </Td>
              <Td>
                <IconButton
                  icon={<SaveOutlinedIcon style={{ color: "white" }} />}
                  aria-label="save"
                  background="green"
                  shadow="sm"
                />
                <IconButton
                  icon={<AddOutlinedIcon style={{ color: "white" }} />}
                  aria-label="save"
                  background="skyblue"
                  ml="3"
                  shadow="sm"
                />
              </Td>
            </Tr>
          </Tbody>
          {/* <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot> */}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default page;
