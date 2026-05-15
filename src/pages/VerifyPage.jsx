import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStatement } from '../api/statements';
import StatementDocument from '../components/StatementDocument';
import { uz, pdfBilingual as L } from '../i18n/uz';
import { buildVerifyUrl } from '../utils/verifyUrl';
import { getQrDataUrl } from '../utils/generatePdf';

export default function VerifyPage() {
  const { id } = useParams();
  const [statement, setStatement] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getStatement(id);
        if (cancelled) return;
        setStatement(data);
        setQrUrl(await getQrDataUrl(buildVerifyUrl(id)));
      } catch (err) {
        if (!cancelled) setError(err.message || uz.errors.notFound);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-200 py-8">
        <p className="text-center font-statement text-sm text-gray-600">{L.verifying}</p>
      </div>
    );
  }

  if (error || !statement) {
    return (
      <div className="min-h-screen bg-neutral-200 py-8">
        <div className="mx-auto max-w-md rounded border border-red-300 bg-white p-8 text-center font-statement">
          <p className="font-bold text-red-800">{L.verifyFailedEn}</p>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <Link to="/" className="mt-6 inline-block text-sm text-blue-800 underline">
            {L.returnAdmin}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-200 py-6 print:bg-white print:py-0">
      <StatementDocument statement={statement} qrUrl={qrUrl} className="print:shadow-none" />
    </div>
  );
}
