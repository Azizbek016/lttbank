import { formatStatementDate } from './formatDate';

export const emptyTransaction = () => ({
  date: '',
  depositAmount: '',
  withdrawalAmount: '0',
  balance: '',
});

export function getDefaultFormState() {
  return {
    statementDate: formatStatementDate(),
    asOfDate: '',
    accountHolderName: '',
    passportNo: '',
    foreignPassportNo: '',
    foreignPassportFullName: '',
    accountType: 'Demand deposit account in USD',
    accountNumber: '',
    currency: 'USD',
    totalBalance: '',
    totalBalanceWords: '',
    transactions: [emptyTransaction()],
  };
}
