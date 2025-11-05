/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckpointStatusInput, Tracker, TrackerInput } from "@/types/types";
import { showAlertDanger } from "@/lib/sweetalert-alert";

export const APP_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"; // pastikan ada /api di akhir
async function fetchWithAuth<T = any>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any
): Promise<T> {
  const res = await fetch(`${APP_URL}/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  let json: any;
  try {
    json = await res.json(); // ✅ baca sekali saja
  } catch {
    // kalau bukan JSON (misal HTML atau kosong)
    json = {};
  }

  

  // 🔐 Optional: redirect kalau 401
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Unauthorized');
  }

  // ❌ Kalau gagal (bukan 2xx)
  if (!res.ok) {
    if (res.status === 404) {
      return null as any;
    }

    const errorMessage =
      json?.message || json?.error || json?.detail || `HTTP ${res.status}: ${res.statusText}`;

    showAlertDanger({
      title: 'Error',
      html: errorMessage,
      confirmButtonText: 'OK',
    });

    throw new Error(errorMessage);
  }

  // ✅ Berhasil
  return json as T;
}


async function fetchPublic<T = any>(
  path: string,
  method: 'GET' | 'POST',
  body?: any
): Promise<T> {
  const res = await fetch(`${APP_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json(); // ✅ hanya sekali

  console.log("fetchPublic response:", json);

  if (!res.ok) {
    showAlertDanger({
      title: 'Error',
      html: json.message || 'Terjadi kesalahan saat mengambil data',
      confirmButtonText: 'OK',
    });
    throw new Error(json.message || 'Failed to fetch data');
  }

  return json;
}

// ✅ TRACKER
export async function createTracker(data: TrackerInput) {
  return fetchWithAuth("/tracker/create", "POST", data);
}

export async function fetchTrackers(): Promise<Tracker[]> {
  try {
    return await fetchWithAuth("/trackers", "GET");
  } catch (err) {
    console.error("Error fetching trackers:", err);
    return [];
  }
}

export async function fetchTrackerById(id: string) {
  return fetchWithAuth(`/tracker/${id}`, "GET");
}

export async function getTrackerById(id: string) {
  const res = await fetchTrackerById(id);
  return res;
}
export async function getTrackerDetail(id: string) {
  const res = await fetchTrackerById(id);
  return res;
} // alias of getTrackerDetail  

export async function getTrackerSummary(email: string) {
  const res: any = await fetchWithAuth(`/tracker/summary/${email}`, "GET");
  return res.data;
}

// ✅ CHECKPOINT
export async function completeCheckpoint(data: CheckpointStatusInput) {
  return fetchWithAuth("/checkpoint/complete", "POST", data);
}

export async function submitCheckpoint(data: CheckpointStatusInput) {
  return completeCheckpoint(data); // alias
}

// ✅ EVIDENCE
export async function viewEvidenceFile(hash: string) {
  return fetchWithAuth(`/evidence?hash=${hash}`, "GET");
}

// ✅ AUTH
export async function requestOtp(email: string) {
  return fetchPublic("/auth/request-otp", "POST", { email });
}

export async function requestVerifyOtp(email: string, otp: string) {
  const res = await fetchWithAuth("/auth/verify-otp", "POST", { email, otp });

  // Tidak perlu return false di client!
  return res;
}

export async function logout() {
  return fetchWithAuth("/auth/logout", "POST");
}

export async function checkAuth() {
  const res = await fetch(`${APP_URL}/auth/me`, {
    method: "POST",
    credentials: "include", // ⬅️ penting agar cookie dikirim
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function getUserInfo() {
  return fetchWithAuth("/auth/me", "POST");
}

export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const res: any = await fetchWithAuth("/auth/me", "POST");
    return res.email || null;
  } catch (err) {
    console.error("Error fetching user email:", err);
    return null;
  }
}
