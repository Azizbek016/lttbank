import { useEffect, useState } from 'react';
import { uz } from '../i18n/uz';
import { emptyTransaction, getDefaultFormState } from '../utils/formDefaults';

export default function StatementForm({ onSubmit, loading, resetKey = 0 }) {
  const [form, setForm] = useState(getDefaultFormState);
  const t = uz;

  useEffect(() => {
    if (resetKey > 0) {
      setForm(getDefaultFormState());
    }
  }, [resetKey]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateTransaction = (index, field, value) => {
    setForm((prev) => {
      const transactions = [...prev.transactions];
      transactions[index] = { ...transactions[index], [field]: value };
      return { ...prev, transactions };
    });
  };

  const addTransaction = () => {
    setForm((prev) => ({
      ...prev,
      transactions: [...prev.transactions, emptyTransaction()],
    }));
  };

  const removeTransaction = (index) => {
    if (form.transactions.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      statementDate: form.statementDate,
      asOfDate: form.asOfDate,
      accountHolderName: form.accountHolderName,
      passportNo: form.passportNo,
      foreignPassportNo: form.foreignPassportNo,
      foreignPassportFullName: form.foreignPassportFullName,
      accountType: form.accountType,
      accountNumber: form.accountNumber,
      currency: form.currency,
      totalBalance: form.totalBalance,
      totalBalanceWords: form.totalBalanceWords,
      transactions: form.transactions.map((tx) => ({
        date: tx.date,
        depositAmount: tx.depositAmount || 0,
        withdrawalAmount: tx.withdrawalAmount || 0,
        balance: tx.balance,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-kdb-navy">{t.sections.documentDates}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.fields.statementDate} required>
            <input
              type="text"
              placeholder={t.placeholders.statementDate}
              value={form.statementDate}
              onChange={(e) => update('statementDate', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label={t.fields.asOfDate} required>
            <input
              type="text"
              placeholder={t.placeholders.asOfDate}
              value={form.asOfDate}
              onChange={(e) => update('asOfDate', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-kdb-navy">{t.sections.accountHolder}</h2>
        <div className="grid gap-4">
          <Field label={t.fields.accountHolderName} required>
            <input
              type="text"
              placeholder={t.placeholders.accountHolder}
              value={form.accountHolderName}
              onChange={(e) => update('accountHolderName', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.fields.passportNo}>
              <input
                type="text"
                placeholder={t.placeholders.passport}
                value={form.passportNo}
                onChange={(e) => update('passportNo', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label={t.fields.foreignPassportNo}>
              <input
                type="text"
                value={form.foreignPassportNo}
                onChange={(e) => update('foreignPassportNo', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label={t.fields.foreignPassportFullName}>
            <textarea
              rows={3}
              placeholder={t.placeholders.foreignPassportName}
              value={form.foreignPassportFullName}
              onChange={(e) => update('foreignPassportFullName', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-kdb-navy">{t.sections.accountDetails}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.fields.accountType} required className="sm:col-span-2">
            <input
              type="text"
              value={form.accountType}
              onChange={(e) => update('accountType', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label={t.fields.accountNumber} required>
            <input
              type="text"
              value={form.accountNumber}
              onChange={(e) => update('accountNumber', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label={t.fields.currency}>
            <select
              value={form.currency}
              onChange={(e) => update('currency', e.target.value)}
              className={inputClass}
            >
              <option value="USD">USD</option>
              <option value="UZS">UZS</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-kdb-navy">{t.sections.transactions}</h2>
          <button
            type="button"
            onClick={addTransaction}
            className="text-sm font-medium text-kdb-blue hover:underline"
          >
            {t.buttons.addRow}
          </button>
        </div>
        <div className="space-y-4">
          {form.transactions.map((tx, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-5"
            >
              <Field label={t.fields.txDate} required>
                <input
                  type="text"
                  placeholder={t.placeholders.txDate}
                  value={tx.date}
                  onChange={(e) => updateTransaction(index, 'date', e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label={t.fields.txDeposit}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tx.depositAmount}
                  onChange={(e) => updateTransaction(index, 'depositAmount', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t.fields.txWithdrawal}>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tx.withdrawalAmount}
                  onChange={(e) => updateTransaction(index, 'withdrawalAmount', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t.fields.txBalance} required>
                <input
                  type="number"
                  step="0.01"
                  value={tx.balance}
                  onChange={(e) => updateTransaction(index, 'balance', e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <div className="flex items-end">
                {form.transactions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTransaction(index)}
                    className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    {t.buttons.removeRow}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-kdb-navy">{t.sections.finalBalance}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.fields.totalBalance} required>
            <input
              type="number"
              step="0.01"
              value={form.totalBalance}
              onChange={(e) => update('totalBalance', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label={t.fields.totalBalanceWords} required>
            <input
              type="text"
              placeholder={t.placeholders.totalBalanceWords}
              value={form.totalBalanceWords}
              onChange={(e) => update('totalBalanceWords', e.target.value)}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-kdb-navy px-6 py-3 text-sm font-semibold text-white shadow hover:bg-kdb-blue disabled:opacity-60"
      >
        {loading ? t.buttons.saving : t.buttons.save}
      </button>
    </form>
  );
}

function Field({ label, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-kdb-blue focus:outline-none focus:ring-1 focus:ring-kdb-blue';
