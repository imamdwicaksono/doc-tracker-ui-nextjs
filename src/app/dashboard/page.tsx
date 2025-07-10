// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrackerSummary, getUserInfo } from "@/lib/api";

export default function DashboardPage() {
    
    const [email, setEmail] = useState<string>('')
    const [totalPengajuan, setTotalPengajuan] = useState<number>(0)
    const [totalComplete, setTotalComplete] = useState<number>(0)
    const [totalOnProgress, setTotalOnProgress] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const email = await getUserInfo().then(res => {
                if (!res) return ''
                return res.email || ''
            })
            setEmail(email)
            // Panggil fungsi untuk mendapatkan statistik setelah email didapat
            const summary = await getTrackerSummary(email)
            .then((data) => {
                console.log("✅ Summary API response:", data);
                return data;
            })
            .catch((err) => {
                console.error("❌ Fetch summary failed:", err);
                return null;
            });
            if (summary) {
                console.log("✅ Summary data:", summary);
                // Setel state dengan data yang diterima
                // Pastikan summary memiliki properti yang sesuai
            
                setTotalPengajuan((summary?.complete || 0) + (summary?.progress || 0));
                // Setel totalPengajuan sebagai jumlah dari complete dan progress
                setTotalComplete(summary?.complete || 0);
                // Setel totalComplete dengan nilai dari summary
                setTotalOnProgress(summary?.progress || 0);
                
                console.log("✅ Total Pengajuan:", totalPengajuan);
                console.log("✅ Total Complete:", totalComplete);
                console.log("✅ Total On Progress:", totalOnProgress);

            }
        };
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
   
    return (
        <>
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-700">Hy {email}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Pengajuan */}
            <div className="p-6 bg-white border-l-4 border-blue-500 shadow-md rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-700">Jumlah Pengajuan Tracking</h2>
            <p className="mt-2 text-4xl font-bold text-blue-600">{totalPengajuan}</p>
            </div>

            {/* Complete */}
            <div className="p-6 bg-white border-l-4 border-green-500 shadow-md rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-700">Jumlah Pengajuan Tracking Selesai</h2>
            <p className="mt-2 text-4xl font-bold text-green-600">{totalComplete}</p>
            </div>

            {/* Pending */}
            <div className="p-6 bg-white border-l-4 border-yellow-500 shadow-md rounded-2xl">
            <h2 className="text-xl font-semibold text-gray-700">Jumlah Pengajuan Tracking On Progress</h2>
            <p className="mt-2 text-4xl font-bold text-yellow-600">{totalOnProgress}</p>
            </div>
        </div>

        {/* Tambahkan komponen seperti: */}
        <ul className="mt-6 space-y-2">
            <li>Lihat semua tracker <Link href="/trackers" className="text-blue-500">di sini</Link></li>
            <li>Buat tracker baru <Link href="/trackers/create" className="text-blue-500">di sini</Link></li>
            <li>Status dokumen terakhir <Link href="/status" className="text-blue-500">di sini</Link></li>
        </ul>
        </>
    );
}
