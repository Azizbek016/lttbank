import { pdfBilingual as L } from '../i18n/uz';
import {
  formatAmount,
  formatBalanceWords,
  formatTotalBalanceLine,
  formatWithdrawal,
  splitForeignPassportName,
} from '../utils/statementFormat';

/**
 * Namuna PDF bilan bir xil ko‘rinish — veb tasdiqlash sahifasi.
 */
export default function StatementDocument({ statement, qrUrl, className = '' }) {
  const fp = splitForeignPassportName(statement.accountHolder.foreignPassportFullName);

  return (
    <div
      className={`statement-doc mx-auto bg-white text-black shadow-lg ${className}`}
      style={{
        maxWidth: '210mm',
        minHeight: '297mm',
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize: '10pt',
        lineHeight: 1.35,
        padding: '14mm 18mm 18mm',
      }}
    >
      <header className="text-[9pt] leading-snug text-[#1e1e1e]">
        {L.bankLines.map((line) => (
          <div key={line}>{line}</div>
        ))}
        <div>{L.regNo}</div>
      </header>

      <p className="mt-3 text-[10pt]">{L.date(statement.statementDate)}</p>

      <p className="mt-3 text-[10pt]">
        <span className="font-bold">{L.accountHolder}</span>
        {statement.accountHolder.name}
      </p>

      <p className="mt-2 text-[10pt]">
        {L.passportNo} {statement.accountHolder.passportNo || ''}
        {'    '}
        {L.foreignPassportNo}
      </p>
      {statement.accountHolder.foreignPassportNo && (
        <p className="mt-0.5 pl-[12mm] text-[10pt]">{statement.accountHolder.foreignPassportNo}</p>
      )}

      <p className="mt-2 text-[10pt]">Foreign Passport Full</p>
      <p className="text-[10pt]">Name:{fp.firstLine ? ` ${fp.firstLine}` : ''}</p>
      {fp.continuation.map((line, i) => (
        <p key={i} className="text-[10pt]">
          {line}
        </p>
      ))}

      <p className="mt-3 text-[10pt] font-bold">{L.typeOfAccount}</p>
      <p className="ml-[3mm] text-[10pt]">a. {statement.account.type}</p>
      <p className="ml-[3mm] text-[10pt]">{L.accountNumber(statement.account.number)}</p>
      <p className="ml-[3mm] text-[10pt]">{L.accountStatement}</p>

      <div className="mt-3 overflow-x-auto text-[9pt]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="font-bold">
              <th className="py-1 pr-2 text-left align-bottom">{L.table.date}</th>
              <th className="py-1 pr-2 text-left align-bottom">{L.table.deposit}</th>
              <th className="py-1 pr-2 text-left align-bottom">{L.table.withdrawal}</th>
              <th className="py-1 text-left align-bottom">{L.table.balance}</th>
            </tr>
          </thead>
          <tbody>
            {statement.transactions.map((tx, i) => (
              <tr key={i}>
                <td className="py-1 pr-2 align-top whitespace-nowrap">{tx.date}</td>
                <td className="py-1 pr-2 align-top">{formatAmount(tx.depositAmount)}</td>
                <td className="py-1 pr-2 align-top">{formatWithdrawal(tx.withdrawalAmount)}</td>
                <td className="py-1 align-top">{formatAmount(tx.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-[10pt]">
        <p>{formatTotalBalanceLine(statement.account.currency, statement.totalBalance)}</p>
        <p className="mt-1">{formatBalanceWords(statement.totalBalanceWords)}</p>
        <p className="mt-1">{L.asOf(statement.asOfDate)}</p>
      </div>

      <div className="relative mt-10 min-h-[32mm]">
        <div className="max-w-[72%] pr-2 text-[7.5pt] leading-snug text-[#2d2d2d]">
          <p>{L.footerEn}</p>
          <p className="mt-1.5">{L.footerUz}</p>
        </div>
        {qrUrl && (
          <img
            src={qrUrl}
            alt=""
            className="absolute right-0 top-0 h-[28mm] w-[28mm]"
            width={106}
            height={106}
          />
        )}
      </div>

      <footer className="mt-8 text-[10pt]">
        <p className="text-[11pt] font-bold text-[#1a2b4a]">{L.bankName}</p>
        <p className="mt-0.5 text-[9pt]">{L.mobileApp}</p>
      </footer>
    </div>
  );
}
