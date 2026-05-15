import { useCallback, useEffect, useState } from 'react';
import {
  createStatement,
  deleteStatement,
  listStatements,
} from '../api/statements';
import StatementForm from '../components/StatementForm';
import StatementListTable from '../components/StatementListTable';
import { uz } from '../i18n/uz';
import { buildVerifyUrl } from '../utils/verifyUrl';
import { downloadStatementPdf } from '../utils/generatePdf';

export default function AdminDashboard() {
  const t = uz;
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formResetKey, setFormResetKey] = useState(0);

  const loadList = useCallback(async () => {
    try {
      const data = await listStatements();
      setSaved(data);
    } catch (err) {
      setError(err.message || t.messages.loadError);
    }
  }, [t.messages.loadError]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleSave = async (payload) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createStatement(payload);
      setFormResetKey((k) => k + 1);
      setSuccess(t.messages.saveSuccess);
      await loadList();
    } catch (err) {
      setError(err.message || t.messages.saveError);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (statement) => {
    try {
      await downloadStatementPdf(statement, buildVerifyUrl(statement.id));
    } catch {
      setError('PDF yaratishda xatolik.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.messages.deleteConfirm)) return;

    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      await deleteStatement(id);
      setSuccess(t.messages.deleteSuccess);
      await loadList();
    } catch (err) {
      setError(err.message || t.messages.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <p className="text-xs font-medium uppercase tracking-wider text-kdb-gold">
            {t.app.subtitle}
          </p>
          <h1 className="text-2xl font-bold text-kdb-navy">{t.app.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{t.app.description}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-kdb-navy">{t.nav.addData}</h2>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              {success}
            </div>
          )}

          <StatementForm
            onSubmit={handleSave}
            loading={loading}
            resetKey={formResetKey}
          />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-kdb-navy">{t.messages.savedList}</h2>
          <StatementListTable
            statements={saved}
            onDownload={handleDownloadPdf}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </section>
      </main>
    </div>
  );
}
