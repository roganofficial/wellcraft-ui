import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Flex,
  Select,
  Text,
  Input,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddJobEntryModal = ({
  masterData,
  onClose,
  transactionId,
  refetchTransactions,
  entryModalData,
  deleteJobCardEntry,
  currentTransaction,
}: {
  masterData: any;
  onClose: () => void;
  transactionId: string;
  refetchTransactions: () => void;
}) => {
  console.log(masterData.typeOfWork);
  const [typeOfWork, setTypeOfWork] = useState("");
  const [materialThickness, setMaterialThickness] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [sizeUnit, setSizeUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [machineNumber, setMachineNumber] = useState("");
  const [timeOfWork, setTimeOfWork] = useState("");
  const [remark, setRemark] = useState("");
  const [image, setImage] = useState();

  const addJobCard = async () => {
    if (entryModalData) {
      deleteJobCardEntry(
        currentTransaction?.data?.jobCards?.find(
          (jobCard) => jobCard.status === "unpaid"
        )._id,
        entryModalData._id
      );
    }
    const formData = new FormData();
    formData.append(
      "description",
      `${typeOfWork} in ${materialThickness} mm ${materialName}`
    );
    formData.append("height", height);
    formData.append("width", width);
    formData.append("sizeUnit", sizeUnit);
    formData.append("quantity", quantity);
    formData.append("machineNumber", machineNumber);
    formData.append("timeOfWork", timeOfWork);
    formData.append("remark", remark);
    formData.append("transactionId", String(transactionId));
    if (image) {
      formData.append("image", image);
    }

    axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}jobCards`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((e) => {
        toast("Job Card saved successfully", { type: "success" });
        refetchTransactions();
        onClose();
        // refetchJobCards();
        // resetFields();
      })
      .catch((err) => {
        toast("Job Card saving failed", { type: "error" });
      });
  };

  async function pasteImg() {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          var file = new File([blob], "image", {
            type: "image/jpeg",
          });
          console.log(URL.createObjectURL(file));
          setImage(file);
          // we can now use blob here
        }
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  useEffect(() => {
    if (entryModalData) {
      const description = entryModalData.description.split("in");
      const typeOfWork = description[0];
      const remainText = description[1]
        .split(" ")
        .filter((e) => !!e)
        .map((e) => e.trim());
      const materialThickness = remainText[0];
      const materialName = remainText[remainText.length - 1];
      setTypeOfWork(typeOfWork.trim());
      setMaterialThickness(materialThickness.trim());
      setMaterialName(materialName);
      setHeight(entryModalData.height);
      setWidth(entryModalData.width);
      setSizeUnit(entryModalData.sizeUnit);
      setQuantity(entryModalData.quantity);
      setMachineNumber(entryModalData.machineNumber);
      setTimeOfWork(entryModalData.timeOfWork);
      setRemark(entryModalData.remark);
      setImage(entryModalData.image);
    }
  }, [entryModalData]);

  return (
    <>
      <Modal isOpen={true} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Job Card Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody onPaste={() => pasteImg()}>
            <Box as="label" fontWeight="semibold">
              Description
            </Box>
            <Flex mt="2" alignItems="center">
              <Select
                placeholder="Type of work"
                value={typeOfWork}
                onChange={(e) => setTypeOfWork(e.target.value)}
              >
                {masterData?.typeOfWork.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Text fontSize="18" mx="2">
                in
              </Text>
              <Select
                placeholder="Material thickness"
                value={materialThickness}
                onChange={(e) => setMaterialThickness(e.target.value)}
              >
                {masterData?.thickness.map((item: string, index: number) => (
                  <option value={item} key={index}>
                    {item} mm
                  </option>
                ))}
              </Select>
              <Text fontSize="28" mx="2">
                +
              </Text>
              <Select
                placeholder="Material name"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
              >
                {masterData?.materials.map((item: string, index: number) => (
                  <option value={item} key={index}>
                    {item}
                  </option>
                ))}
              </Select>
            </Flex>
            <Divider my="5" bg="black" h="1px" />
            <Flex alignItems="center">
              <Box mr="3">
                <Box as="label" fontWeight="semibold">
                  Size
                </Box>
                <Flex alignItems="center" mt="3">
                  <Input
                    w="32"
                    placeholder="width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                  />
                  <Text ml="3" fontSize="24">
                    x
                  </Text>
                  <Input
                    mx="3"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    w="32"
                    placeholder="height"
                  />
                  <Select
                    placeholder="Select unit"
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value)}
                  >
                    <option>mm</option>
                    <option>inch</option>
                  </Select>
                </Flex>
              </Box>
            </Flex>
            <Divider my="5" bg="black" h="0.5px" />
            <Flex>
              <Box mx="3" w="48">
                <Box as="label" fontWeight="semibold">
                  Ouantity
                </Box>
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="quantity"
                  mt="2"
                />
              </Box>
              <Box mx="3">
                <Box as="label" fontWeight="semibold">
                  Machine
                </Box>
                <Select
                  placeholder="Select Machine"
                  mt="2"
                  value={machineNumber}
                  onChange={(e) => setMachineNumber(e.target.value)}
                >
                  {masterData?.cncMachines.map(
                    (item: string, index: number) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    )
                  )}
                </Select>
              </Box>
              <Box ml="3" w="48">
                <Box as="label" fontWeight="semibold">
                  Time of work
                </Box>
                <Input
                  value={timeOfWork}
                  onChange={(e) => setTimeOfWork(e.target.value)}
                  placeholder="in minutes"
                  mt="2"
                />
              </Box>
            </Flex>
            <Divider my="5" bg="black" h="1px" />
            <Box as="label" fontWeight="semibold">
              Upload Screenshot
            </Box>
            {image ? (
              <Image
                width={240}
                height={135}
                src={
                  typeof image === "string"
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${image}`
                    : URL.createObjectURL(image)
                }
                alt="upload-image"
                onClick={() => setImage(null)}
              />
            ) : (
              // <Button onClick={pasteImg}>paste</Button>
              <Input
                height="38"
                mt="2"
                border="none"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            )}
            <Divider my="5" bg="black" h="1px" />
            <Box>
              <Box as="label" fontWeight="semibold">
                Remark
              </Box>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter remark here"
                mt="2"
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={addJobCard} ml="3" bg="teal.300">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddJobEntryModal;
