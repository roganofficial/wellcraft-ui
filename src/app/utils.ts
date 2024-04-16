export const saveImage = async (url, filename) => {
  const imageData = await fetch(url);
  const imageBlob = await imageData.blob();
  const blobUrl = URL.createObjectURL(imageBlob);

  // Create a link element
  const link = document.createElement("a");
  link.href = blobUrl;

  // Set the download attribute and filename
  link.setAttribute("download", filename);

  // Append the link to the body (for Firefox)
  document.body.appendChild(link);

  // Trigger the click event to initiate the download
  link.click();

  // Remove the link from the DOM
  document.body.removeChild(link);
  return;
};
