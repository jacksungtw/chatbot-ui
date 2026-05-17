import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

// 直接 import pdf-parse 的內部模組，繞過 entry-point 的測試檔讀取（會在 build 後爆炸）
// 參考：https://gitlab.com/autokent/pdf-parse/-/issues/24
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse/lib/pdf-parse.js")

export const processPdf = async (pdf: Blob): Promise<FileItemChunk[]> => {
  const arrayBuffer = await pdf.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const data = await pdfParse(buffer)
  const completeText: string = data?.text || ""

  if (!completeText.trim()) {
    throw new Error("PDF 解析後沒有文字內容（可能是掃描影像 PDF，需要 OCR）")
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
  })
  const splitDocs = await splitter.createDocuments([completeText])

  const chunks: FileItemChunk[] = splitDocs.map(doc => ({
    content: doc.pageContent,
    tokens: encode(doc.pageContent).length
  }))

  return chunks
}
