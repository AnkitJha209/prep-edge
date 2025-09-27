import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { embedding, textspliter } from './langchainFn';
import { QdrantVectorStore } from '@langchain/qdrant';

export const ingestResume = async (resumeUrl: string, fileName: string) => {
    try {
        const response = await fetch(resumeUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const loader = new PDFLoader(new Blob([buffer]), { splitPages: false });
        const allDocs = await loader.load();

        const chunks = await textspliter.splitDocuments(allDocs);

        await QdrantVectorStore.fromDocuments(chunks, embedding, {
            url: "http://localhost:6333",
            collectionName: fileName,
        });
    } catch (error) {
        console.log(error)
    }
}