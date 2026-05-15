import { Link } from 'react-router-dom';
import { uz } from '../i18n/uz';

export default function StatementListTable({
  statements,
  onDownload,
  onDelete,
  deletingId,
}) {
  const t = uz;

  if (statements.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
        {t.messages.noStatements}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">{t.list.holder}</th>
              <th className="px-4 py-3 font-semibold text-slate-700">{t.list.date}</th>
              <th className="px-4 py-3 font-semibold text-slate-700">{t.list.account}</th>
              <th className="px-4 py-3 font-semibold text-slate-700 text-right">
                {t.list.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {statements.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80">
                <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-900">
                  {item.accountHolder.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {item.statementDate}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {item.account.number}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onDownload(item)}
                      className="rounded-lg bg-kdb-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-kdb-blue"
                    >
                      {t.buttons.download}
                    </button>
                    <Link
                      to={`/verify/${item.id}`}
                      target="_blank"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-kdb-blue hover:bg-slate-50"
                    >
                      {t.buttons.verify}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === item.id ? t.buttons.deleting : t.buttons.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
