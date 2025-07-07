import { CheckpointStatusInput, Tracker, TrackerInput } from "@/types/types";
import { handleError } from "./handle_error";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createTracker(data: TrackerInput) {
  const res = await fetch(`${API_URL}/api/tracker/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Unauthorized');
  }

  const response = await res.json();
  if (!res.ok) return handleError(response, "createTracker");

  return response;
}

export async function fetchTrackers(): Promise<Tracker[]> {
  try {
    const res = await fetch(`${API_URL}/api/trackers`, {
      method: "GET",
      headers: { ...getAuthHeader() },
    });

    if (!res.ok) {
      console.error('Fetch failed:', res.status);
      return [];
    }

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized');
    }

    const data: Tracker[] = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching trackers:', err);
    return [];
  }
}

export async function fetchTrackerById(id: string) {
  const res = await fetch(`${API_URL}/api/tracker/${id}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Unauthorized');
  }

  const response = await res.json();
  if (!res.ok) return handleError(response, "fetchTrackerById");

  return response;
}

export async function completeCheckpoint(data: CheckpointStatusInput) {
  const res = await fetch(`${API_URL}/api/checkpoint/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "completeCheckpoint");

  return response;
}

export async function getTrackerById(id: string) {
  const res = await fetch(`${API_URL}/api/tracker/${id}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "fetchTrackerById");

  return response;
}

export async function submitCheckpoint(payload: CheckpointStatusInput) {
  const res = await fetch(`${API_URL}/checkpoint/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "submitCheckpoint");

  return response;
}

export async function requestOtp(email: string) {
  const res = await fetch(`${API_URL}/api/auth/request-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "requestOtp");

  return response;
}

export async function requestVerifyOtp(email: string, otp: string) {
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "verifyOtp");

  return response;
}

export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: { ...getAuthHeader() },
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "logout");

  return response;
}

export async function checkAuth() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  return res.status === 200;
}

export async function getUserInfo() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return null;

  return await res.json();
}

export async function viewEvidenceFile(hash: string) {
  const res = await fetch(`${API_URL}/api/evidence?hash=${hash}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "viewEvidenceFile");

  return response;
}

export async function getTrackerSummary(email: string) {
  const res = await fetch(`${API_URL}/api/tracker/summary/${email}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('Unauthorized');
  }

  const response = await res.json();
  if (!res.ok) return handleError(response, "getTrackerSummary");

  return response.data;
}
