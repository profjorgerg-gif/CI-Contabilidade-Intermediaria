// Abre uma janela só com o conteúdo informado e aciona a impressão do
// navegador — a pessoa escolhe "Salvar como PDF" como destino, gerando um
// arquivo PDF de verdade sem precisar de nenhuma biblioteca extra.
export function imprimirComoPdf(titulo, html) {
  const janela = window.open("", "_blank");
  janela.document.write(`
    <html><head><title>${titulo}</title>
    <style>
      body{font-family:Georgia,serif;color:#1C2B2D;max-width:820px;margin:30px auto;line-height:1.5;}
      h1{font-size:20px;margin-bottom:4px;} h2{font-size:15px;border-bottom:1px solid #DCD6C6;padding-bottom:4px;margin-top:22px;}
      table{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:8px;}
      th{text-align:left;font-size:10.5px;text-transform:uppercase;color:#5B6B6C;border-bottom:1px solid #DCD6C6;padding:5px 6px;}
      td{padding:5px 6px;border-bottom:1px solid #EEEBE0;}
      .subtotal td{font-weight:bold;border-top:1px solid #1C2B2D;}
    </style></head><body>${html}</body></html>
  `);
  janela.document.close();
  janela.focus();
  setTimeout(() => janela.print(), 300);
}
