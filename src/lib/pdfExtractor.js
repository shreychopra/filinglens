export async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const script = document.getElementById('pdfjs-script');
    if (!script) {
      const s = document.createElement('script');
      s.id = 'pdfjs-script';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = () => loadAndExtract(file, resolve, reject);
      s.onerror = () => reject(new Error('Failed to load PDF.js'));
      document.head.appendChild(s);
    } else {
      loadAndExtract(file, resolve, reject);
    }
  });
}

function loadAndExtract(file, resolve, reject) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) {
    reject(new Error('PDF.js not loaded'));
    return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let fullText = '';
      const maxPages = Math.min(pdf.numPages, 120);

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length < 100) {
        reject(new Error('Could not extract text from this PDF. It may be a scanned image.'));
        return;
      }

      resolve({ text: fullText, pageCount: pdf.numPages });
    } catch (err) {
      reject(new Error('Error reading PDF: ' + err.message));
    }
  };
  reader.onerror = () => reject(new Error('Could not read the file'));
  reader.readAsArrayBuffer(file);
}
