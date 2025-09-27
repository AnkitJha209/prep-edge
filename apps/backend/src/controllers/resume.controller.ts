import { NextFunction, Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw Error('Azure Storage Connection string not found');
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerName = 'prepedge-resumes'; // Replace with your container name

export const resumeUpload = async (req:Request, res:Response) => {
    try {
        if(!(req as any).file){
            res.status(400).json({
                success: false,
                message: "File is missing"
            })
        }
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobName = `${Date.now()}-${(req as any).file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData((req as any).file.buffer, {
            blobHTTPHeaders: { blobContentType: (req as any).file.mimetype }
        });

        const fileUrl = blockBlobClient.url as string
        res.status(200).json({
            success: true,
            message: "Resume Uploaded successfully",
            file: {
                resumeUrl: fileUrl,
                name: blobName
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}