import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User, Report, Analytics, ModerationTask } from '../../types';
import { Line } from 'react-chartjs-2';

const AdminDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, matches: 0 });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [moderationTasks, setModerationTasks] = useState<ModerationTask[]>([]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetchUsers();
      fetchReports();
      fetchStats();
      fetchAnalytics();
      fetchModerationTasks();
    }
  }, [session]);

  const fetchUsers = async () => {
    const response = await fetch('/api/admin/users');
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  const fetchReports = async () => {
    const response = await fetch('/api/admin/reports');
    if (response.ok) {
      const data = await response.json();
      setReports(data);
    }
  };

  const fetchStats = async () => {
    const response = await fetch('/api/admin/stats');
    if (response.ok) {
      const data = await response.json();
      setStats(data);
    }
  };

  const fetchAnalytics = async () => {
    const response = await fetch('/api/admin/analytics');
    if (response.ok) {
      const data = await response.json();
      setAnalytics(data);
    }
  };

  const fetchModerationTasks = async () => {
    const response = await fetch('/api/admin/moderation-tasks');
    if (response.ok) {
      const data = await response.json();
      setModerationTasks(data);
    }
  };

  const handleBanUser = async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}/ban`, { method: 'POST' });
    if (response.ok) {
      fetchUsers();
    }
  };

  const handleDismissReport = async (reportId: string) => {
    const response = await fetch(`/api/admin/reports/${reportId}/dismiss`, { method: 'POST' });
    if (response.ok) {
      fetchReports();
    }
  };

  const handleModerateContent = async (taskId: string, decision: 'approve' | 'reject') => {
    const response = await fetch(`/api/admin/moderation-tasks/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    });
    if (response.ok) {
      fetchModerationTasks();
    }
  };

  if (session?.user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Stats</h2>
        <p>Total Users: {stats.totalUsers}</p>
        <p>Active Users: {stats.activeUsers}</p>
        <p>Total Matches: {stats.matches}</p>
      </div>
      <div>
        <h2>User Management</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleBanUser(user.id)}>Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Reports</h2>
        <table>
          <thead>
            <tr>
              <th>Reporting User</th>
              <th>Reported User</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.reportingUserId}</td>
                <td>{report.reportedUserId}</td>
                <td>{report.reason}</td>
                <td>
                  <button onClick={() => handleDismissReport(report.id)}>Dismiss</button>
                  <button onClick={() => handleBanUser(report.reportedUserId)}>Ban User</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Analytics</h2>
        {analytics && (
          <>
            <Line data={analytics.userGrowth} options={{ responsive: true }} />
            <Line data={analytics.matchesPerDay} options={{ responsive: true }} />
            <div>
              <h3>User Retention</h3>
              <p>7-day retention: {analytics.retention.sevenDay}%</p>
              <p>30-day retention: {analytics.retention.thirtyDay}%</p>
            </div>
          </>
        )}
      </div>
      <div>
        <h2>Content Moderation</h2>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Content Type</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {moderationTasks.map(task => (
              <tr key={task.id}>
                <td>{task.userId}</td>
                <td>{task.contentType}</td>
                <td>{task.contentType === 'photo' ? <img src={task.content} alt="User upload" style={{width: 100}} /> : task.content}</td>
                <td>
                  <button onClick={() => handleModerateContent(task.id, 'approve')}>Approve</button>
                  <button onClick={() => handleModerateContent(task.id, 'reject')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;