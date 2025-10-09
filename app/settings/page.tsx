'use client';

import { useRef, useState } from 'react';
import { useVocab } from '@/components/providers/VocabProvider';
import type { AppSettings } from '@/types/settings';
import type { MergePreview } from '@/types/vocab';

const strategies = [
  { value: 'append-only', label: 'Append Only (เพิ่มเฉพาะคำใหม่)' },
  { value: 'upsert', label: 'Upsert (แทนที่คำเดิม)' },
  { value: 'skip-duplicates', label: 'Skip Duplicates (ข้ามคำซ้ำ)' }
] as const;

type Strategy = (typeof strategies)[number]['value'];

export default function SettingsPage() {
  const {
    settings,
    setSettings,
    queueImport,
    commitImport,
    rollbackImport,
    customVocabulary,
    clearStats
  } = useVocab();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string | undefined>();
  const [preview, setPreview] = useState<MergePreview | undefined>();
  const [strategy, setStrategy] = useState<Strategy>('append-only');
  const [loading, setLoading] = useState(false);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings({ ...settings, ...patch });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setStatus(undefined);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const result = queueImport(json);
      setPreview(result);
      setStatus('นำเข้าข้อมูลสำเร็จ: กรุณาเลือกวิธีรวมแล้วกด Commit');
    } catch (error) {
      console.error(error);
      setStatus('เกิดข้อผิดพลาดในการอ่านไฟล์');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    setLoading(true);
    setStatus(undefined);
    try {
      const result = await commitImport(strategy);
      if (result) {
        setStatus(`นำเข้าสำเร็จ เพิ่ม ${result.importedCount} คำ (อัปเดต ${result.updatedCount})`);
        setPreview(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
      setStatus('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = () => {
    rollbackImport();
    setPreview(undefined);
    setStatus('ยกเลิกข้อมูลนำเข้าชั่วคราวแล้ว');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    const payload = {
      _meta: {
        source: 'custom_export',
        version: '1.0.0',
        level: 'N5'
      },
      items: customVocabulary
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jlpt-vocab-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h1 className="text-2xl font-bold">การตั้งค่า</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.showKana}
              onChange={(event) => updateSettings({ showKana: event.target.checked })}
            />
            <span className="text-sm">แสดงคำอ่าน (คานะ)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.enableAudio}
              onChange={(event) => updateSettings({ enableAudio: event.target.checked })}
            />
            <span className="text-sm">เปิดเสียงคำอ่าน (เร็วๆ นี้)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(event) => updateSettings({ darkMode: event.target.checked })}
            />
            <span className="text-sm">โหมดมืด</span>
          </label>
          <label className="flex items-center gap-3">
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={settings.language}
              onChange={(event) => updateSettings({ language: event.target.value as AppSettings['language'] })}
            >
              <option value="th">ไทย</option>
              <option value="jp">日本語</option>
            </select>
            <span className="text-sm">ภาษา UI</span>
          </label>
        </div>
      </section>
      <section className="rounded-2xl bg-white/70 p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold">Import / Export JSON</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleCommit}
            disabled={!preview || loading}
            className="rounded-xl bg-sky px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Commit
          </button>
          <button
            type="button"
            onClick={handleRollback}
            className="rounded-xl border border-moss px-4 py-2 text-sm font-semibold"
          >
            Rollback
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl border border-moss px-4 py-2 text-sm font-semibold"
          >
            Export JSON
          </button>
        </div>
        <div>
          <label className="text-sm font-semibold">กลยุทธ์การรวมข้อมูล</label>
          <div className="mt-2 flex flex-col gap-2">
            {strategies.map((item) => (
              <label key={item.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="merge-strategy"
                  value={item.value}
                  checked={strategy === item.value}
                  onChange={(event) => setStrategy(event.target.value as Strategy)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
        {preview && (
          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm">
            <p>คำใหม่: {preview.newItems.length}</p>
            <p>คำซ้ำ: {preview.duplicates.length}</p>
            <p>คำชนกัน: {preview.conflicts.length}</p>
          </div>
        )}
        {status && <p className="text-sm text-sky">{status}</p>}
      </section>
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h2 className="text-xl font-semibold">จัดการข้อมูล</h2>
        <button
          type="button"
          onClick={() => clearStats()}
          className="rounded-xl border border-red-400 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          ล้างสถิติทั้งหมด
        </button>
      </section>
    </div>
  );
}
