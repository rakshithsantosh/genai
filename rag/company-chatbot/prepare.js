import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = loader.load();
}
