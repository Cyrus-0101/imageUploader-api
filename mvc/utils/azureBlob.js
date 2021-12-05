const { Readable } = require('stream');
const { BlobServiceClient } = require('@azure/storage-blob');

const azureBlobString = process.env.AZURE_STORAGE_CONNECTION_STRING;
// Create the BlobServiceClient object which will be used to create a container client
const blobServiceClient = BlobServiceClient.fromConnectionString(
  azureBlobString
);

const bufferToStream = buff => {
  const stream = new Readable();
  stream.push(buff);
  stream.push(null);
  return stream;
};

exports.uploadImage = async (buffer, finalName, container) => {
  const containerClient = blobServiceClient.getContainerClient(container);
  // Create a blob
  const blockBlobClient = containerClient.getBlockBlobClient(finalName);
  const blobOptions = { blobHTTPHeaders: { blobContentType: 'image/jpeg' } };
  return await blockBlobClient.uploadStream(
    bufferToStream(buffer),
    undefined,
    undefined,
    blobOptions
  );
};

exports.deleteBlob = async (blob, container) => {
  const containerClient = blobServiceClient.getContainerClient(container);
  // Delete a blob
  const blockBlobClient = containerClient.getBlockBlobClient(blob);
  return await blockBlobClient.deleteIfExists({ deleteSnapshots: 'include' });
};
