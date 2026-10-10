/**
 * Utilitário de alta performance para processamento e otimização de documentos e imagens.
 * Suporta PDF, Word (.docx, .doc), Texto Puro (.txt, .md, .csv) e Imagens.
 * Evita travamentos e lentidão convertendo os arquivos diretamente em Markdown estruturado no cliente.
 */

export const MAX_DOC_SIZE_MB = 10;
export const MAX_DOC_SIZE_BYTES = MAX_DOC_SIZE_MB * 1024 * 1024;

/**
 * Comprime uma imagem no navegador utilizando Canvas para manter o payload leve (<250 KB).
 */
export async function compressImage(
  fileOrBase64: File | string,
  maxWidth = 1280,
  maxHeight = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();

    const processImage = () => {
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(typeof fileOrBase64 === "string" ? fileOrBase64 : "");
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.onload = processImage;
    img.onerror = () => {
      resolve(typeof fileOrBase64 === "string" ? fileOrBase64 : "");
    };

    if (typeof fileOrBase64 === "string") {
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || "";
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(fileOrBase64);
    }
  });
}

/**
 * Lê arquivo de texto puro (.txt, .md, .csv, etc.) com detecção de encoding UTF-8 / Latin1.
 */
export async function readTextFile(file: File): Promise<string> {
  try {
    const text = await file.text();
    if (text && text.trim().length > 0) {
      return text.trim();
    }
  } catch (err) {
    console.warn("Falha no file.text(), tentando FileReader com UTF-8:", err);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve((reader.result as string) || "");
    };
    reader.onerror = () => {
      // Fallback para Latin1 (ISO-8859-1) se UTF-8 der erro
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve((fallbackReader.result as string) || "");
      fallbackReader.onerror = () => reject(new Error("Não foi possível ler o arquivo de texto."));
      fallbackReader.readAsText(file, "ISO-8859-1");
    };
    reader.readAsText(file, "UTF-8");
  });
}

/**
 * Carrega a biblioteca Mammoth dinamicamente via CDN para leitura de arquivos Word (.docx).
 */
async function loadMammoth(): Promise<any> {
  if (typeof window === "undefined") return null;

  const win = window as any;
  if (win.mammoth) return win.mammoth;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
    script.async = true;
    script.onload = () => {
      if (win.mammoth) {
        resolve(win.mammoth);
      } else {
        reject(new Error("Mammoth indisponível após carregamento."));
      }
    };
    script.onerror = () => reject(new Error("Falha ao carregar script do Mammoth."));
    document.head.appendChild(script);
  });
}

/**
 * Extrai texto e formata como Markdown a partir de um arquivo Word (.docx ou .doc).
 */
export async function readWordFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // 1. Tenta extrair com Mammoth (alta fidelidade para .docx)
  try {
    const mammoth = await loadMammoth();
    if (mammoth) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result && result.value && result.value.trim().length > 10) {
        return result.value.trim();
      }
    }
  } catch (mammothErr) {
    console.warn("Mammoth falhou, tentando extração direta de texto XML do docx:", mammothErr);
  }

  // 2. Fallback de emergência para arquivos .doc antigos ou docx sem biblioteca
  try {
    const bytes = new Uint8Array(arrayBuffer.slice(0, 500 * 1024));
    let raw = "";
    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i];
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || (code >= 192 && code <= 255)) {
        raw += String.fromCharCode(code);
      }
    }

    // Busca nós de texto do Word (<w:t>texto</w:t>)
    const textMatches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
    if (textMatches.length > 0) {
      const extracted = textMatches
        .map((m) => m.replace(/<[^>]+>/g, "").trim())
        .filter((s) => s.length > 0)
        .join(" ");
      if (extracted.length > 20) return extracted;
    }

    // Fallback de palavras legíveis gerais
    const words = raw.match(/[A-Za-z0-9À-ÿ$.,/–-]{3,}/g) || [];
    return words.slice(0, 400).join(" ");
  } catch (err) {
    console.warn("Erro no fallback de documento Word:", err);
    return "";
  }
}

/**
 * Carrega a biblioteca PDF.js dinamicamente via CDN de forma segura.
 */
async function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return null;

  const win = window as any;
  if (win.pdfjsLib) return win.pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjs = win.pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(pdfjs);
      } else {
        reject(new Error("pdfjsLib indisponível após carregamento."));
      }
    };
    script.onerror = () => reject(new Error("Falha ao carregar script do PDF.js."));
    document.head.appendChild(script);
  });
}

/**
 * Extrai texto das primeiras páginas do PDF e formata como Markdown estruturado.
 */
export async function convertPdfToMarkdown(
  file: File,
  maxPages = 6
): Promise<{
  markdown: string;
  pageCount: number;
  isScanned: boolean;
  firstPageImage?: string;
}> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfjs = await loadPdfJs();
    if (pdfjs) {
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      const pagesToRead = Math.min(totalPages, maxPages);

      let markdownOutput = `# Resumo Executivo do Documento: ${file.name}\n\n`;
      markdownOutput += `*Total de páginas no documento: ${totalPages} | Páginas analisadas: 1 a ${pagesToRead}*\n\n`;

      let totalExtractedLength = 0;
      let firstPageImageDataUrl = "";

      for (let pageNum = 1; pageNum <= pagesToRead; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageStrings = textContent.items
          .map((item: any) => (item.str ? item.str.trim() : ""))
          .filter((str: string) => str.length > 0);

        const pageText = pageStrings.join(" ");
        totalExtractedLength += pageText.length;

        markdownOutput += `### Seção / Página ${pageNum}\n${pageText || "*(Sem texto legível nesta página)*"}\n\n`;

        if (pageNum === 1 && pageText.length < 50) {
          try {
            const viewport = page.getViewport({ scale: 1.0 });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = Math.min(viewport.width, 1000);
            canvas.height = (viewport.height / viewport.width) * canvas.width;
            if (ctx) {
              await page.render({
                canvasContext: ctx,
                viewport: page.getViewport({ scale: canvas.width / viewport.width }),
              }).promise;
              firstPageImageDataUrl = canvas.toDataURL("image/jpeg", 0.75);
            }
          } catch (renderErr) {
            console.warn("Erro ao renderizar primeira página do PDF:", renderErr);
          }
        }
      }

      const isScanned = totalExtractedLength < 80;

      return {
        markdown: markdownOutput.slice(0, 15000),
        pageCount: totalPages,
        isScanned,
        firstPageImage: firstPageImageDataUrl || undefined,
      };
    }
  } catch (pdfJsErr) {
    console.warn("PDF.js falhou, usando extrator nativo em texto:", pdfJsErr);
  }

  // Fallback nativo
  try {
    const bytes = new Uint8Array(arrayBuffer.slice(0, 500 * 1024));
    let rawText = "";

    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i];
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || (code >= 192 && code <= 255)) {
        rawText += String.fromCharCode(code);
      }
    }

    const matches = rawText.match(/\(([^)]{3,})\)/g) || [];
    const cleanTokens = matches
      .map((m) => m.slice(1, -1).replace(/\\([()\\])/g, "$1").trim())
      .filter((s) => s.length > 2 && /[a-zA-Z0-9À-ÿ]/.test(s));

    const extracted = cleanTokens.slice(0, 500).join(" ");
    const markdown = `# Conteúdo Extraído do Documento: ${file.name}\n\n${extracted || "Texto condensado do teaser de negócio."}`;

    return {
      markdown: markdown.slice(0, 10000),
      pageCount: 1,
      isScanned: extracted.length < 50,
    };
  } catch (fallbackErr) {
    console.warn("Erro no extrator fallback:", fallbackErr);
    return {
      markdown: `# Documento: ${file.name}\n\nArquivo anexado para verificação.`,
      pageCount: 1,
      isScanned: true,
    };
  }
}

/**
 * Função unificada que aceita QUALQUER tipo de documento (TXT, MD, Word, PDF)
 * e o converte instantaneamente em Markdown estruturado para envio à IA.
 */
export async function convertAnyDocumentToMarkdown(file: File): Promise<{
  markdown: string;
  isScanned?: boolean;
  firstPageImage?: string;
  detectedType: "text" | "word" | "pdf";
}> {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // 1. Arquivos de Texto Puro (.txt, .md, .csv, .rtf, .json, etc.)
  if (
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md") ||
    fileName.endsWith(".csv") ||
    fileName.endsWith(".rtf") ||
    fileName.endsWith(".json") ||
    fileType.startsWith("text/")
  ) {
    const rawText = await readTextFile(file);
    const markdown = `# Documento de Resumo Executivo: ${file.name}\n\n${rawText.slice(0, 15000)}`;
    return {
      markdown,
      detectedType: "text",
    };
  }

  // 2. Arquivos do Word (.docx, .doc)
  if (
    fileName.endsWith(".docx") ||
    fileName.endsWith(".doc") ||
    fileType.includes("word") ||
    fileType.includes("officedocument.wordprocessingml")
  ) {
    const wordText = await readWordFile(file);
    const markdown = `# Documento Word: ${file.name}\n\n${wordText.slice(0, 15000)}`;
    return {
      markdown,
      detectedType: "word",
    };
  }

  // 3. Arquivos PDF (.pdf)
  const pdfResult = await convertPdfToMarkdown(file, 6);
  return {
    markdown: pdfResult.markdown,
    isScanned: pdfResult.isScanned,
    firstPageImage: pdfResult.firstPageImage,
    detectedType: "pdf",
  };
}
