
import { useEffect, useState } from "react";

import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import Alert from "../../../components/feedback/Alert/Alert";

import {
    getAdminAttendanceByDate,
} from "../../../services/attendance/attendanceApi";

import "./Attendance.css";

const today = () => new Date().toISOString().slice(0, 10);

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString() : "-";

function Attendance() {
    const [date, setDate] = useState(today());
    const [type, setType] = useState("MEMBER");

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminAttendanceByDate(
                date,
                type
            );

            setRecords(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load attendance records."
            );
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        loadAttendance();
    };

    return (
        <section className="admin-attendance">
            <header className="admin-attendance__header">
                <span>ADMINISTRATION</span>
                <h1>Attendance Management</h1>
                <p>
                    View and monitor Member and Trainer attendance records.
                </p>
            </header>

            {error && <Alert type="error" message={error} />}

            <Card
                title="Attendance Filters"
                subtitle="Choose a date and attendance category."
            >
                <form
                    className="admin-attendance__filters"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="attendance-date">
                            Attendance Date
                        </label>
                        <input
                            id="attendance-date"
                            type="date"
                            value={date}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="attendance-type">
                            Attendance Type
                        </label>
                        <select
                            id="attendance-type"
                            value={type}
                            onChange={(event) =>
                                setType(event.target.value)
                            }
                        >
                            <option value="MEMBER">Members</option>
                            <option value="TRAINER">Trainers</option>
                        </select>
                    </div>

                    <Button type="submit" loading={loading}>
                        Apply Filters
                    </Button>
                </form>
            </Card>

            <Card
                title={`${type === "MEMBER" ? "Member" : "Trainer"} Attendance`}
                subtitle={`Records for ${date}`}
            >
                <div className="admin-attendance__summary">
                    <div>
                        <span>Total Records</span>
                        <strong>{records.length}</strong>
                    </div>

                    <div>
                        <span>Present</span>
                        <strong>
                            {
                                records.filter(
                                    (record) =>
                                        record.attendanceStatus === "PRESENT"
                                ).length
                            }
                        </strong>
                    </div>

                    <div>
                        <span>Checked Out</span>
                        <strong>
                            {
                                records.filter(
                                    (record) =>
                                        record.attendanceStatus === "CHECKED_OUT"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                {loading ? (
                    <p>Loading attendance records...</p>
                ) : records.length === 0 ? (
                    <p>No attendance records found for this selection.</p>
                ) : (
                    <div className="attendance-table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Attendance ID</th>
                                    <th>
                                        {type === "MEMBER"
                                            ? "Member ID"
                                            : "Trainer ID"}
                                    </th>
                                    <th>Date</th>
                                    <th>Check In</th>
                                    <th>
                                        {type === "MEMBER"
                                            ? "Last Visit"
                                            : "Check Out"}
                                    </th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                    <th>Source</th>
                                </tr>
                            </thead>

                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.attendanceId}>
                                        <td>{record.attendanceId}</td>
                                        <td>
                                            {type === "MEMBER"
                                                ? record.memberId ?? "-"
                                                : record.trainerId ?? "-"}
                                        </td>
                                        <td>{record.attendanceDate}</td>
                                        <td>
                                            {formatDateTime(record.checkInTime)}
                                        </td>
                                        <td>
                                            {type === "MEMBER"
                                                ? formatDateTime(record.lastVisitTime)
                                                : "-"}
                                        </td>
                                        <td>
                                            {formatDateTime(record.checkOutTime)}
                                        </td>
                                        <td>{record.attendanceStatus}</td>
                                        <td>{record.attendanceSource || "-"}</td>
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
