import { useState, type FormEvent } from 'react';
import type { Bin } from './types/bin';
import {
  getBins,
  createBin,
  deleteBin,
  updateBin,
  createComplaint,
  getComplaints,
  getComplaintsByBin,
  updateComplaintStatus,
  deleteComplaint,
} from './services/binService';
import type { Complaint } from './services/binService';

type UserRole = 'admin' | 'user' | null;
type UserPortalView = 'home' | 'nearby' | 'report' | 'track';

type ComplaintForm = {
  binCode: string;
  issueType: string;
  description: string;
  reporterEmail: string;
};

const issueTypes = ['Overflowing', 'Damaged Bin', 'Bad Smell', 'Blocked Access', 'Other'];

export default function App() {
  const [role, setRole] = useState<UserRole>('user');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [bins, setBins] = useState<Bin[]>([]);
  const [loadingBins, setLoadingBins] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  const [createData, setCreateData] = useState({ binCode: '', location: '' });
  const [form, setForm] = useState<ComplaintForm>({
    binCode: '',
    issueType: issueTypes[0],
    description: '',
    reporterEmail: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [userView, setUserView] = useState<UserPortalView>('home');
  const [trackBinCode, setTrackBinCode] = useState('');
  const [trackResults, setTrackResults] = useState<Complaint[]>([]);
  const [trackingMessage, setTrackingMessage] = useState('');

  const login = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setRole('admin');
      setShowAdminLogin(false);
      setError('');
      setMessage('');
      setUserView('home');
      loadBins();
      loadComplaints();
    } else {
      setError('Invalid admin username or password');
      setMessage('');
    }
  };

  const loadBins = async () => {
    setLoadingBins(true);
    try {
      const data = await getBins();
      setBins(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load bins.');
    } finally {
      setLoadingBins(false);
    }
  };

  const loadComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (e) {
      console.error(e);
      setError('Failed to load complaints.');
    } finally {
      setLoadingComplaints(false);
    }
  };

  const submitIssue = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setTrackingMessage('');

    const finalDescription = form.issueType === 'Other' ? form.description : form.issueType;

    if (!form.binCode || !form.reporterEmail || (form.issueType === 'Other' && !form.description)) {
      setError('Please complete all required fields before submitting.');
      return;
    }

    try {
      await createComplaint({ ...form, description: finalDescription });
      setSubmitted(true);
      setMessage('Complaint submitted successfully.');
      setForm({ ...form, description: '', reporterEmail: '' });
      if (role === 'admin') loadComplaints();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to submit complaint.');
    }
  };

  const handleCreateBin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!createData.binCode || !createData.location) {
      setError('Bin code and location are required.');
      return;
    }

    if (!createData.binCode.match(/^[A-Z]{3}-\d{3}$/)) {
      setError("Bin code must be in format 'BIN-001' (3 uppercase letters, hyphen, 3 numbers)");
      return;
    }

    try {
      await createBin({
        binCode: createData.binCode,
        location: createData.location,
        fillLevel: 'Empty',
        status: 'ACTIVE',
      });
      setCreateData({ binCode: '', location: '' });
      await loadBins();
      setMessage('Bin created successfully.');
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to create bin.');
    }
  };

  const handleDeleteBin = async (id: string) => {
    if (!confirm('Delete this bin?')) return;
    try {
      await deleteBin(id);
      await loadBins();
      setMessage('Bin deleted successfully.');
    } catch (e) {
      console.error(e);
      setError('Failed to delete bin.');
    }
  };

  const handleUpdateFill = async (id: string, fillLevel: string) => {
    try {
      await updateBin(id, { fillLevel });
      await loadBins();
      setMessage('Bin fill level updated.');
    } catch (e) {
      console.error(e);
      setError('Failed to update bin fill level.');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateBin(id, { status });
      await loadBins();
      setMessage('Bin status updated.');
    } catch (e) {
      console.error(e);
      setError('Failed to update bin status.');
    }
  };

  const handleUpdateComplaintStatus = async (id: string, status: string) => {
    try {
      await updateComplaintStatus(id, status);
      await loadComplaints();
      setMessage('Complaint status updated.');
    } catch (e) {
      console.error(e);
      setError('Failed to update complaint status.');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Permanent delete: Are you sure you want to delete this issue report?')) return;
    try {
      await deleteComplaint(id);
      await loadComplaints();
      setMessage('Complaint deleted successfully.');
    } catch (e) {
      console.error(e);
      setError('Failed to delete complaint.');
    }
  };

  const handleTrackStatus = async () => {
    setError('');
    setMessage('');
    setTrackingMessage('');

    if (!trackBinCode) {
      setError('Enter a bin code to track status.');
      return;
    }

    try {
      const results = await getComplaintsByBin(trackBinCode);
      setTrackResults(results);
      setTrackingMessage(results.length ? `Found ${results.length} report(s) for bin ${trackBinCode}.` : 'No reports found for this bin code.');
    } catch (e) {
      console.error(e);
      setError('Failed to load bin status.');
    }
  };

  const logout = () => {
    setRole('user');
    setUsername('');
    setPassword('');
    setError('');
    setMessage('');
    setSubmitted(false);
    setUserView('home');
    setTrackBinCode('');
    setTrackResults([]);
  };

  const userPortalHeader = (
    <section style={sectionStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Citizen Portal</h2>
        <button type="button" style={secondaryButtonStyle} onClick={() => setShowAdminLogin(true)}>
          Admin Login
        </button>
      </div>
      <p>Choose an action after scanning the QR code on the bin.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
        <button type="button" style={secondaryButtonStyle} onClick={async () => { setUserView('nearby'); await loadBins(); setMessage(''); setTrackingMessage(''); }}>
          View Nearby Bins
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => { setUserView('report'); setMessage(''); setTrackingMessage(''); }}>
          Submit Issue Report
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => { setUserView('track'); setMessage(''); setTrackingMessage(''); }}>
          Track Status
        </button>
      </div>
    </section>
  );

  if (showAdminLogin) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Admin Login</h1>
          <p style={subtitleStyle}>Access restricted to administrators.</p>
          <form onSubmit={login} style={formStyle}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={inputStyle} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={inputStyle} />
            {error ? <div style={errorStyle}>{error}</div> : null}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={primaryButtonStyle}>Login</button>
              <button type="button" onClick={() => { setShowAdminLogin(false); setError(''); }} style={secondaryButtonStyle}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ margin: 0 }}>{role === 'admin' ? 'Admin Dashboard' : 'Citizen Portal'}</h1>
        {role === 'admin' ? (
          <button onClick={logout} style={secondaryButtonStyle}>Logout</button>
        ) : null}
      </div>

      {error ? <div style={errorStyle}>{error}</div> : null}
      {message ? <div style={successStyle}>{message}</div> : null}
      {trackingMessage ? <div style={successStyle}>{trackingMessage}</div> : null}

      {role === 'admin' ? (
        <>
          <section style={sectionStyle}>
            <h2>Bin Management</h2>
            <form onSubmit={handleCreateBin} style={formStyle}>
              <input
                value={createData.binCode}
                onChange={(e) => setCreateData({ ...createData, binCode: e.target.value })}
                placeholder="Bin Code"
                style={inputStyle}
              />
              <input
                value={createData.location}
                onChange={(e) => setCreateData({ ...createData, location: e.target.value })}
                placeholder="Location"
                style={inputStyle}
              />
              <button type="submit" style={primaryButtonStyle}>Add Bin</button>
            </form>

            {loadingBins ? (
              <p>Loading bins...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Bin Code</th>
                      <th>Location</th>
                      <th>Fill Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bins.map((bin) => (
                      <tr key={bin.id ?? bin.binCode}>
                        <td>{bin.binCode}</td>
                        <td>{bin.location}</td>
                        <td>{bin.fillLevel}</td>
                        <td>{bin.status}</td>
                        <td style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {bin.id ? <button onClick={() => handleUpdateFill(bin.id!, 'Empty')} style={secondaryButtonStyle}>Empty</button> : null}
                          {bin.id ? <button onClick={() => handleUpdateFill(bin.id!, 'Half')} style={secondaryButtonStyle}>Half</button> : null}
                          {bin.id ? <button onClick={() => handleUpdateFill(bin.id!, 'Full')} style={secondaryButtonStyle}>Full</button> : null}
                          {bin.id ? (
                            <button onClick={() => handleUpdateStatus(bin.id!, bin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')} style={secondaryButtonStyle}>
                              {bin.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                          ) : null}
                          {bin.id ? <button onClick={() => handleDeleteBin(bin.id!)} style={dangerButtonStyle}>Delete</button> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section style={sectionStyle}>
            <h2>Reported Complaints</h2>
            {loadingComplaints ? (
              <p>Loading complaints...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th>Bin Code</th>
                      <th>Issue</th>
                      <th>Description</th>
                      <th>Reporter</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint) => (
                      <tr key={complaint.id ?? `${complaint.binCode}-${complaint.issueType}`}>
                        <td>{complaint.binCode}</td>
                        <td>{complaint.issueType}</td>
                        <td>{complaint.description}</td>
                        <td>{complaint.reporterEmail}</td>
                        <td>{complaint.status}</td>
                        <td>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : '-'}</td>
                        <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {complaint.id ? (
                            <>
                              <button onClick={() => handleUpdateComplaintStatus(complaint.id!, 'IN_PROGRESS')} style={secondaryButtonStyle}>In Progress</button>
                              <button onClick={() => handleUpdateComplaintStatus(complaint.id!, 'RESOLVED')} style={primaryButtonStyle}>Resolve</button>
                              <button onClick={() => handleDeleteComplaint(complaint.id!)} style={{ ...primaryButtonStyle, background: '#dc2626' }}>Delete</button>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          {userPortalHeader}
          {userView === 'nearby' ? (
            <section style={sectionStyle}>
              <h2>Nearby Bins</h2>
              <p>Bins are loaded from the backend. Scan the QR code on a bin to get the code, then choose a report or track option.</p>
              {loadingBins ? (
                <p>Loading bins...</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th>Bin Code</th>
                        <th>Location</th>
                        <th>Fill Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bins.map((bin) => (
                        <tr key={bin.id ?? bin.binCode}>
                          <td>{bin.binCode}</td>
                          <td>{bin.location}</td>
                          <td>{bin.fillLevel}</td>
                          <td>{bin.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ) : null}

          {userView === 'report' ? (
            <section style={sectionStyle}>
              <h2>Submit Issue Report</h2>
              <p>Enter the bin code, then submit the issue.</p>
              
              <form onSubmit={submitIssue} style={formStyle}>
                <input
                  value={form.binCode}
                  onChange={(e) => setForm({ ...form, binCode: e.target.value })}
                  placeholder="Enter Bin Code"
                  style={inputStyle}
                />
                <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value })} style={inputStyle}>
                  {issueTypes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {form.issueType === 'Other' && (
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the issue"
                    style={{ ...inputStyle, minHeight: '100px' }}
                  />
                )}
                <input
                  value={form.reporterEmail}
                  onChange={(e) => setForm({ ...form, reporterEmail: e.target.value })}
                  placeholder="Your email"
                  style={inputStyle}
                />
                <button type="submit" style={primaryButtonStyle}>Submit Issue</button>
              </form>
              {submitted ? <div style={successStyle}>Thank you! Your report has been sent.</div> : null}
            </section>
          ) : null}

          {userView === 'track' ? (
            <section style={sectionStyle}>
              <h2>Track Bin Status</h2>
              <p>Enter the bin code to track the status of reported issues.</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                <input
                  value={trackBinCode}
                  onChange={(e) => setTrackBinCode(e.target.value)}
                  placeholder="Enter Bin Code"
                  style={inputStyle}
                />
                <button type="button" onClick={handleTrackStatus} style={primaryButtonStyle}>Track Status</button>
              </div>
              {trackResults.length > 0 ? (
                <div style={{ overflowX: 'auto', marginTop: '20px' }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th>Issue</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Reporter</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackResults.map((complaint) => (
                        <tr key={complaint.id ?? `${complaint.binCode}-${complaint.issueType}`}>
                          <td>{complaint.issueType}</td>
                          <td>{complaint.description}</td>
                          <td>{complaint.status}</td>
                          <td>{complaint.reporterEmail}</td>
                          <td>{complaint.createdAt ? new Date(complaint.createdAt).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: '#f8fafc',
  padding: '24px',
  fontFamily: 'Inter, system-ui, sans-serif',
} as const;

const cardStyle = {
  width: '100%',
  maxWidth: '720px',
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  padding: '24px',
  marginTop: '16px',
} as const;

const sectionStyle = {
  marginTop: '24px',
  background: 'white',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 8px 18px rgba(15,23,42,0.08)',
} as const;

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '16px',
  maxWidth: '720px',
} as const;

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '14px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  outline: 'none',
} as const;

const primaryButtonStyle = {
  borderRadius: '10px',
  background: '#2563eb',
  color: 'white',
  padding: '12px 18px',
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const secondaryButtonStyle = {
  borderRadius: '10px',
  background: '#64748b',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  cursor: 'pointer',
} as const;

const dangerButtonStyle = {
  ...secondaryButtonStyle,
  background: '#dc2626',
} as const;

const titleStyle = {
  margin: '0 0 8px',
  color: '#0f172a',
  fontSize: '24px',
} as const;

const subtitleStyle = {
  margin: '0 0 20px',
  color: '#64748b',
} as const;



const errorStyle = {
  color: '#b91c1c',
  marginTop: '12px',
  padding: '12px',
  borderRadius: '12px',
  background: '#fef2f2',
} as const;

const successStyle = {
  color: '#166534',
  marginTop: '12px',
  padding: '12px',
  borderRadius: '12px',
  background: '#dcfce7',
} as const;

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '16px',
} as const;
