'use client';

import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  BarElement
} from 'chart.js';
import { useMemo } from 'react';
import { useVocab } from '@/components/providers/VocabProvider';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsPage() {
  const { aggregatedStats, topMistakes } = useVocab();

  const chartData = useMemo(() => {
    const labels = topMistakes.map(({ vocab }) => vocab?.kanji || vocab?.kana || 'ไม่ทราบ');
    const wrongCounts = topMistakes.map(({ stat }) => stat.wrongCount);
    return {
      labels,
      datasets: [
        {
          label: 'จำนวนที่ตอบผิด',
          data: wrongCounts,
          backgroundColor: '#f97316'
        }
      ]
    };
  }, [topMistakes]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h1 className="text-2xl font-bold">แผงควบคุมสถิติ</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-moss">จำนวนคำทั้งหมดที่ตอบ</p>
            <p className="text-3xl font-bold">{aggregatedStats.totalAnswered}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-moss">ความแม่นยำเฉลี่ย</p>
            <p className="text-3xl font-bold">{(aggregatedStats.accuracy * 100).toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-moss">สถิติ Streak สูงสุด</p>
            <p className="text-3xl font-bold">{aggregatedStats.streak}</p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl bg-white/70 p-6 shadow">
        <h2 className="text-xl font-semibold">Top 10 คำที่พลาดบ่อย</h2>
        {topMistakes.length === 0 ? (
          <p className="text-sm text-moss">ยังไม่มีข้อมูลคำที่พลาด</p>
        ) : (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        )}
      </section>
    </div>
  );
}
