/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckpointStatusInput, Tracker, TrackerInput } from "@/types/types";
import { showAlertDanger } from "@/lib/sweetalert-alert";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

async function fetchWithAuth<T = any>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Unauthorized');
  }

  const json = await res.json();
  if (!res.ok) {
    const errorResult = await res.json();
    showAlertDanger({
      title: 'Error',
      html: errorResult.message,
      confirmButtonText: 'OK',
    });
    throw new Error(errorResult.message || 'Failed to fetch data');
  }
  return json;
}

async function fetchPublic<T = any>(
  path: string,
  method: 'GET' | 'POST',
  body?: any
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    const errorResult = await res.json();
    showAlertDanger({
      title: 'Error',
      html: errorResult.message,
      confirmButtonText: 'OK',
    });
    throw new Error(errorResult.message || 'Failed to fetch data');
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
  return fetchTrackerById(id); // alias
}

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
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "POST",
    credentials: "include", // ⬅️ penting agar cookie dikirim
    headers: { "Content-Type": "application/json" },
  });
  return res.status === 200;
}

export async function getUserInfo() {
  return fetchWithAuth("/auth/me", "POST");
}
