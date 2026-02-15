import { BlobServiceClient } from "@azure/storage-blob";
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()



const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING as string,
);

const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER_NAME as string,
);

export const pdfUpload = async (pdfBuffer: Buffer) => {
    const fileName = `${crypto.randomUUID()}.pdf`

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.uploadData(pdfBuffer, {
        blobHTTPHeaders:{
            blobContentType: 'application/pdf'
        }
    })
    return blockBlobClient.url
}