import type { Bin } from '../types/bin';

// Fetch all bins from Spring Boot
export const getBins = async (): Promise<Bin[]> => {
  const res = await fetch('/api/bins');
  if (!res.ok) throw new Error('Failed to fetch waste bins from Spring Boot');
  return res.json();
};

// Update a bin's fill level in MongoDB
export const updateBinLevel = async (id: string, fillLevel: string): Promise<Bin> => {
  const res = await fetch(`/api/bins/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fillLevel }),
  });
  if (!res.ok) throw new Error('Failed to update bin fill level');
  return res.json();
};

export const createBin = async (bin: Partial<Bin>): Promise<Bin> => {
  const res = await fetch(`/api/bins`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bin),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to create bin");
  }
  return res.json();
};

export const deleteBin = async (id: string): Promise<void> => {
  const res = await fetch(`/api/bins/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete bin');
};

export const updateBin = async (id: string, bin: Partial<Bin>): Promise<Bin> => {
  const res = await fetch(`/api/bins/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bin),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "Failed to update bin");
  }
  return res.json();
};


export type Complaint = {
  id?: string;
  binCode: string;
  issueType: string;
  description: string;
  reporterEmail: string;
  status?: string;
  createdAt?: string;
};

export const createComplaint = async (complaint: Complaint): Promise<Complaint> => {
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complaint),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to create complaint');
  }
  return res.json();
};

export const getComplaints = async (): Promise<Complaint[]> => {
  const res = await fetch('/api/complaints');
  if (!res.ok) throw new Error('Failed to fetch complaints');
  return res.json();
};

export const updateComplaintStatus = async (id: string, status: string): Promise<Complaint> => {
  const res = await fetch(`/api/complaints/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update complaint status');
  return res.json();
};


export const getComplaintsByBin = async (binCode: string): Promise<Complaint[]> => {
  const res = await fetch(`/api/complaints/bin/${encodeURIComponent(binCode)}`);
  if (!res.ok) throw new Error('Failed to fetch complaints for bin');
  return res.json();
};
