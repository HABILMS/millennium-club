/**
 * Utilitário de alta performance para processamento e otimização de documentos e imagens.
 * Evita travamentos e lentidão convertendo PDFs diretamente em Markdown e comprimindo imagens no cliente.
 */

export const MAX_PDF_SIZE_MB = 10;
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

/**
 * Comprime uma imagem no navegador utilizando Canvas para evitar envio de payloads gigantescos.
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
 * Em pitch decks e teasers, as primeiras 4 a 6 páginas contêm 100% dos dados relevantes.
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

  // 1. Tentar extração via PDF.js (alta precisão)
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

        // Agrupa itens de texto respeitando quebras e parágrafos
        const pageStrings = textContent.items
          .map((item: any) => (item.str ? item.str.trim() : ""))
          .filter((str: string) => str.length > 0);

        const pageText = pageStrings.join(" ");
        totalExtractedLength += pageText.length;

        markdownOutput += `### Seção / Página ${pageNum}\n${pageText || "*(Sem texto legível nesta página)*"}\n\n`;

        // Se for a primeira página e o texto for muito curto (escaneado), renderiza thumbnail
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
        markdown: markdownOutput.slice(0, 15000), // Limite confortável para IA
        pageCount: totalPages,
        isScanned,
        firstPageImage: firstPageImageDataUrl || undefined,
      };
    }
  } catch (pdfJsErr) {
    console.warn("PDF.js não pôde ser executado, usando extrator nativo em texto:", pdfJsErr);
  }

  // 2. Fallback ultrarrápido nativo (sem dependências externas)
  try {
    const bytes = new Uint8Array(arrayBuffer.slice(0, 500 * 1024)); // Primeiros 500 KB
    let rawText = "";

    // Decodifica apenas caracteres ASCII e UTF-8 visíveis
    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i];
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || (code >= 192 && code <= 255)) {
        rawText += String.fromCharCode(code);
      }
    }

    // Procura por blocos de texto entre parênteses típicos de PDFs
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
