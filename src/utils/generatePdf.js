import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { pdfBilingual as L } from '../i18n/uz';
import {
  formatAmount,
  formatBalanceWords,
  formatTotalBalanceLine,
  formatWithdrawal,
  splitForeignPassportName,
} from './statementFormat';

/** Namuna PDF — mm koordinatalari (A4) */
const ML = 20;
const PAGE_W = 210;

const COL = {
  date: ML + 2,
  deposit: ML + 56,
  withdrawal: ML + 98,
  balance: ML + 140,
};

function drawHeader(doc) {
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);

  let y = 14;
  L.bankLines.forEach((line) => {
    doc.text(line, ML, y);
    y += 4.1;
  });
  doc.text(L.regNo, ML, y);
  return y + 6;
}

function drawBody(doc, statement, startY) {
  let y = startY;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  doc.text(L.date(statement.statementDate), ML, y);
  y += 9;

  // 1. Account holder: NAME — bir qatorda (namuna PDF)
  doc.setFont('times', 'bold');
  const holderLabel = L.accountHolder;
  doc.text(holderLabel, ML, y);
  doc.setFont('times', 'normal');
  doc.text(statement.accountHolder.name, ML + doc.getTextWidth(holderLabel), y);
  y += 7;

  doc.text(
    `${L.passportNo} ${statement.accountHolder.passportNo || ''}    ${L.foreignPassportNo}`,
    ML,
    y
  );
  y += 5.5;

  if (statement.accountHolder.foreignPassportNo) {
    doc.text(statement.accountHolder.foreignPassportNo, ML + 12, y);
    y += 6;
  } else {
    y += 2;
  }

  doc.text('Foreign Passport Full', ML, y);
  y += 5;
  const fp = splitForeignPassportName(statement.accountHolder.foreignPassportFullName);
  if (fp.firstLine) {
    doc.text(`Name: ${fp.firstLine}`, ML, y);
    y += 5;
    fp.continuation.forEach((line) => {
      doc.text(line, ML, y);
      y += 5;
    });
  } else {
    doc.text('Name:', ML, y);
    y += 5;
  }
  y += 2;

  doc.setFont('times', 'bold');
  doc.text(L.typeOfAccount, ML, y);
  y += 6;
  doc.setFont('times', 'normal');
  doc.text(`a. ${statement.account.type}`, ML + 3, y);
  y += 6;
  doc.text(L.accountNumber(statement.account.number), ML + 3, y);
  y += 6;
  doc.text(L.accountStatement, ML + 3, y);
  y += 8;

  // Jadval sarlavhalari — gridsiz, namuna PDF
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.text(L.table.date, COL.date, y);
  doc.text(L.table.deposit, COL.deposit, y);
  doc.text(L.table.withdrawal, COL.withdrawal, y);
  doc.text(L.table.balance, COL.balance, y);
  y += 6;

  doc.setFont('times', 'normal');
  statement.transactions.forEach((tx) => {
    doc.text(tx.date, COL.date, y);
    doc.text(formatAmount(tx.depositAmount), COL.deposit, y);
    doc.text(formatWithdrawal(tx.withdrawalAmount), COL.withdrawal, y);
    doc.text(formatAmount(tx.balance), COL.balance, y);
    y += 6;
  });

  y += 4;
  doc.setFontSize(10);
  doc.text(formatTotalBalanceLine(statement.account.currency, statement.totalBalance), ML, y);
  y += 6;
  doc.text(formatBalanceWords(statement.totalBalanceWords), ML, y);
  y += 6;
  doc.text(L.asOf(statement.asOfDate), ML, y);

  return y + 12;
}

function drawFooter(doc, qrDataUrl) {
  const qrSize = 28;
  const qrX = PAGE_W - ML - qrSize;
  const qrY = 218;
  const textW = qrX - ML - 6;

  doc.setFont('times', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(45, 45, 45);

  let textY = qrY + 2;
  doc.splitTextToSize(L.footerEn, textW).forEach((line) => {
    doc.text(line, ML, textY);
    textY += 3.6;
  });
  textY += 1.5;
  doc.splitTextToSize(L.footerUz, textW).forEach((line) => {
    doc.text(line, ML, textY);
    textY += 3.6;
  });

  doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  const brandY = 262;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 43, 74);
  doc.text(L.bankName, ML, brandY);
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(L.mobileApp, ML, brandY + 5.5);
}

export async function downloadStatementPdf(statement, verifyUrl) {
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 0,
    width: 256,
    errorCorrectionLevel: 'M',
  });

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const afterHeader = drawHeader(doc);
  drawBody(doc, statement, afterHeader + 2);
  drawFooter(doc, qrDataUrl);

  const fileName = `Hisobot_${statement.account.number}_${statement.statementDate.replace(/\./g, '-')}.pdf`;
  doc.save(fileName);
}

export async function getQrDataUrl(verifyUrl) {
  return QRCode.toDataURL(verifyUrl, {
    margin: 0,
    width: 256,
    errorCorrectionLevel: 'M',
  });
}
