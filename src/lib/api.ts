import { CheckpointStatusInput, Tracker, TrackerInput } from "@/types/types";
import { handleError } from "./handle_error";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export async function createTracker(data: TrackerInput) {
  const res = await fetch(`${API_URL}/api/tracker/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  // Jika unauthorized (token invalid/expired)
  if (res.status === 401) {
    // Redirect manual ke login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    throw new Error('Unauthorized')
  }

  const response = await res.json();
  if (!res.ok) return handleError(response, "createTracker");

  return response;
}

export async function fetchTrackers(): Promise<Tracker[]> {
  try {
    const res = await fetch(`${API_URL}/api/trackers`, {
      method: "GET",
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('Fetch failed:', res.status);
      return [];
    }

    // Jika unauthorized (token invalid/expired)
    if (res.status === 401) {
      // Redirect manual ke login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      throw new Error('Unauthorized')
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
    credentials: 'include',
  });

  // Jika unauthorized (token invalid/expired)
  if (res.status === 401) {
    // Redirect manual ke login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    throw new Error('Unauthorized')
  }

  const response = await res.json();
  if (!res.ok) return handleError(response, "fetchTrackerById");

  return response;
}

export async function completeCheckpoint(data: CheckpointStatusInput) {
  const form = new FormData();
  form.append("tracker_id", data.tracker_id);
  form.append("email", data.email);
  form.append("note", data.note);
  form.append("evidence", data.evidence);

  const res = await fetch(`${API_URL}/api/checkpoint/complete`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "completeCheckpoint");

  return response;
}

export async function getTrackerById(id: string) {
  const res = await fetch(`${API_URL}/api/tracker/${id}`, {
    method: "GET",
    credentials: 'include',
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "fetchTrackerById");

  return response;
}

export async function submitCheckpoint(payload: CheckpointStatusInput) {
  const res = await fetch(`${API_URL}/checkpoint/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const response = await res.json();
  if (!res.ok) return handleError(JSON.parse(response), "submitCheckpoint");

  return response;
}


export async function requestOtp(email: string) {
  const res = await fetch(`${API_URL}/api/auth/request-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
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
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "verifyOtp");

  return response;
}

export async function logout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "logout");



  return response;
}

export async function checkAuth() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: 'include',
  })

  return res.status === 200
}

export async function getUserInfo() {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: 'include',
  });

  if (!res.ok) return null

  return await res.json()
}

function clearCookie(res: Response) {
   if (res.status === 401) {
    // Redirect manual ke login
    if (typeof window !== 'undefined') {
      document.cookie = 'authToken=; Max-Age=0; path=/;' // hapus cookie manual
      // window.location.href = '/auth/login'
    }
    return null
  }
}

export async function viewEvidenceFile(hash: string) {
  const res = await fetch(`${API_URL}/api/evidence?hash=${hash}`, {
    method: "GET",
    credentials: 'include',
  });

  const response = await res.json();
  if (!res.ok) return handleError(response, "viewEvidenceFile");

  return response;
}

export async function getTrackerSummary(email: string) {
  const res = await fetch(`${API_URL}/api/tracker/summary/${email}`, {
    method: "GET",
    credentials: 'include',
  });

  if (res.status === 401) {
    // Redirect manual ke login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    throw new Error('Unauthorized')
  }

  const response = await res.json();
  if (!res.ok) return handleError(response, "getTrackerSummary");

  return response.data; // ✅ langsung ambil data
}