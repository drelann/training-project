var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

class DownloaderService {
  downloadAllDocuments(event, documents) {
    if (pdfMake.vfs == undefined) {
      var pdfFonts = require('pdfmake/build/vfs_fonts.js');
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }
    console.log('pass here');
    var docDefinition = {
      content: [],
    };
    docDefinition.content.push({
      text: 'All documents for: ' + event.title,
      lineHeight: 1.25,
      fontSize: 24,
      bold: true,
      margin: [0, 20],
    });
    documents.forEach((document) => {
      docDefinition.content.push({
        text: document.title,
        fontSize: 18,
        bold: true,
        lineHeight: 1.5,
      });
      docDefinition.content.push({
        text: 'Day: ' + document.day,
        fontSize: 15,
        bold: true,
        lineHeight: 1.5,
      });
      docDefinition.content.push({
        text: 'For: ' + document.destination + 's',
        fontSize: 15,
        bold: true,
        lineHeight: 1.5,
      });

      if (document.signed_name) {
        var signer = {
          text: 'Signed by: ' + document.signed_name,
          fontSize: 15,
          bold: true,
          lineHeight: 1.5,
        };
        docDefinition.content.push(signer);
      }
      docDefinition.content.push({
        text: document.content,
        lineHeight: 1.5,
        margin: [0, 20],
      });
    });
    pdfMake.createPdf(docDefinition).download(event.title + '.pdf');
  }
  downloadDocument(document) {
    if (pdfMake.vfs == undefined) {
      var pdfFonts = require('pdfmake/build/vfs_fonts.js');
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }

    var docDefinition = {
      content: [
        {
          text: document.title,
          fontSize: 18,
          bold: true,
          lineHeight: 1.5,
        },
        {
          text: 'Day: ' + document.day,
          fontSize: 15,
          bold: true,
          lineHeight: 1.5,
        },
        {
          text: 'For: ' + document.destination + 's',
          fontSize: 15,
          bold: true,
          lineHeight: 1.5,
        },
      ],
    };
    if (document.signed_name) {
      var signer = {
        text: 'Signed by: ' + document.signed_name,
        fontSize: 15,
        bold: true,
        lineHeight: 1.5,
      };
      docDefinition.content.push(signer);
    }
    docDefinition.content.push({
      text: document.content,
      lineHeight: 1.5,
      margin: [0, 20],
    });
    pdfMake.createPdf(docDefinition).download(document.title + '.pdf');
  }
}

export default new DownloaderService();
