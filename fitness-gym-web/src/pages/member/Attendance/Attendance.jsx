
import { useEffect, useState } from "react";

import useAuth from "../../../hooks/useAuth";

import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import Alert from "../../../components/feedback/Alert/Alert";

import {
    memberCheckIn,
    memberCheckOut,
    getMemberAttendanceHistory,
} from "../../../services/attendance/attendanceApi";

import "./Attendance.css";

const today = () => new Date().toISOString().slice(0, 10);

const dateBefore = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
};

const formatDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString();
};

function Attendance() {
    const { user } = useAuth();

    const [history, setHistory] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const currentRecord = history.find(
        (item) =>
            item.attendanceDate === today() &&
            item.attendanceType === "MEMBER"
    );

    const isCheckedIn =
        currentRecord?.attendanceStatus === "PRESENT";

    const loadHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMemberAttendanceHistory(
                dateBefore(30),
                today()
            );

            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load attendance history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleCheckIn = async () => {
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await memberCheckIn(remarks);

            setSuccess("You have successfully checked in.");
            setRemarks("");

            await loadHistory();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to check in."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await memberCheckOut();

            setSuccess("You have successfully checked out.");

            await loadHistory();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to check out."
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <section className="attendance-page">
            <header className="attendance-header">
                <div>
                    <span className="attendance-eyebrow">
                        MEMBER
                    </span>
                    <h1>My Attendance</h1>
                    <p>
                        Check in, check out and track your gym visits.
                    </p>
                </div>
            </header>

            {error && (
                <Alert type="error" message={error} />
            )}

            {success && (
                <Alert type="success" message={success} />
            )}

            <div className="attendance-summary">
                <Card title="Today's Status">
                    <span
                        className={`attendance-status ${
                            isCheckedIn ? "is-present" : "is-absent"
                        }`}
                    >
                        {isCheckedIn ? "PRESENT" : "NOT CHECKED IN"}
                    </span>

                    <div className="attendance-actions">
                        {!isCheckedIn ? (
                            <Button
                                onClick={handleCheckIn}
                                loading={actionLoading}
                            >
                                Check In
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                onClick={handleCheckOut}
                                loading={actionLoading}
                            >
                                Check Out
                            </Button>
                        )}
                    </div>

                    {!isCheckedIn && (
                        <div className="attendance-remarks">
                            <label htmlFor="member-remarks">
                                Remarks (optional)
                            </label>
                            <textarea
                                id="member-remarks"
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(event.target.value)
                                }
                                placeholder="Add a note..."
                                rows="3"
                            />
                        </div>
                    )}

                    {currentRecord && (
                        <div className="attendance-today-details">
                            <p>
                                First check-in:{" "}
                                <strong>
                                    {formatDateTime(
                                        currentRecord.checkInTime
                                    )}
                                </strong>
                            </p>
                            <p>
                                Last visit:{" "}
                                <strong>
                                    {formatDateTime(
                                        currentRecord.lastVisitTime
                                    )}
                                </strong>
                            </p>
                            <p>
                                Check-out:{" "}
                                <strong>
                                    {formatDateTime(
                                        currentRecord.checkOutTime
                                    )}
                                </strong>
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            <Card
                title="Attendance History"
                subtitle="Your attendance records for the last 30 days."
            >
                {loading ? (
                    <p>Loading attendance history...</p>
                ) : history.length === 0 ? (
                    <p>No attendance records found.</p>
                ) : (
                    <div className="attendance-table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>Last Visit</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.attendanceId}>
                                        <td>{record.attendanceDate}</td>
                                        <td>
                                            {formatDateTime(record.checkInTime)}
                                        </td>
                                        <td>
                                            {formatDateTime(record.lastVisitTime)}
                                        </td>
                                        <td>
                                            {formatDateTime(record.checkOutTime)}
                                        </td>
                                        <td>
                                            <span className="attendance-status">
                                                {record.attendanceStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </section>
    );
}

export default Attendance;
