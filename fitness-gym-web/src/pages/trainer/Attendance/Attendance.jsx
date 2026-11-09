
import { useEffect, useState } from "react";

import useAuth from "../../../hooks/useAuth";

import Button from "../../../components/common/Button/Button";
import Card from "../../../components/common/Card/Card";
import Alert from "../../../components/feedback/Alert/Alert";

import {
    getTrainerClients,
} from "../../../services/trainer/trainerApi";

import {
    trainerCheckIn,
    trainerCheckOut,
    getTrainerAttendanceHistory,
    trainerMarkMemberAttendance,
} from "../../../services/attendance/attendanceApi";

import "./Attendance.css";

const today = () => new Date().toISOString().slice(0, 10);

const dateBefore = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
};

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString() : "-";

function Attendance() {
    const { user } = useAuth();

    const [clients, setClients] = useState([]);
    const [history, setHistory] = useState([]);

    const [selectedMember, setSelectedMember] = useState("");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const todayRecord = history.find(
        (item) =>
            item.attendanceDate === today() &&
            item.attendanceType === "TRAINER"
    );

    const isCheckedIn =
        todayRecord?.attendanceStatus === "PRESENT";

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [clientData, attendanceData] =
                await Promise.all([
                    getTrainerClients(user.trainerId),
                    getTrainerAttendanceHistory(
                        dateBefore(30),
                        today()
                    ),
                ]);

            setClients(
                Array.isArray(clientData) ? clientData : []
            );

            setHistory(
                Array.isArray(attendanceData)
                    ? attendanceData
                    : []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load trainer attendance information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.trainerId) {
            loadData();
        }
    }, [user?.trainerId]);

    const handleTrainerAction = async (action) => {
        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            if (action === "check-in") {
                await trainerCheckIn();
                setSuccess("Your working attendance is checked in.");
            } else {
                await trainerCheckOut();
                setSuccess("Your working attendance is checked out.");
            }

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update your attendance."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkMember = async (event) => {
        event.preventDefault();

        if (!selectedMember) {
            setError("Please select a Member.");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await trainerMarkMemberAttendance(
                selectedMember,
                remarks
            );

            setSuccess("Member attendance recorded successfully.");
            setSelectedMember("");
            setRemarks("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to record Member attendance."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="trainer-attendance">
                <p>Loading attendance...</p>
            </section>
        );
    }

    return (
        <section className="trainer-attendance">
            <header className="trainer-attendance__header">
                <span>TRAINER</span>
                <h1>Attendance Management</h1>
                <p>
                    Manage your working hours and record your clients' attendance.
                </p>
            </header>

            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <Card title="My Working Attendance">
                <span
                    className={`attendance-status ${
                        isCheckedIn ? "is-present" : "is-absent"
                    }`}
                >
                    {isCheckedIn ? "PRESENT" : "NOT CHECKED IN"}
                </span>

                <div className="trainer-attendance__actions">
                    {!isCheckedIn ? (
                        <Button
                            onClick={() =>
                                handleTrainerAction("check-in")
                            }
                            loading={actionLoading}
                        >
                            Check In
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={() =>
                                handleTrainerAction("check-out")
                            }
                            loading={actionLoading}
                        >
                            Check Out
                        </Button>
                    )}
                </div>

                {todayRecord && (
                    <div className="trainer-attendance__details">
                        <p>
                            Check-in:{" "}
                            {formatDateTime(todayRecord.checkInTime)}
                        </p>
                        <p>
                            Check-out:{" "}
                            {formatDateTime(todayRecord.checkOutTime)}
                        </p>
                    </div>
                )}
            </Card>

            <Card
                title="Mark Member Attendance"
                subtitle="Select a Member from your assigned clients."
            >
                <form
                    className="trainer-attendance__form"
                    onSubmit={handleMarkMember}
                >
                    <div>
                        <label htmlFor="attendance-member">
                            Select Member
                        </label>

                        <select
                            id="attendance-member"
                            value={selectedMember}
                            onChange={(event) =>
                                setSelectedMember(event.target.value)
                            }
                            required
                        >
                            <option value="">
                                Choose a Member
                            </option>

                            {clients.map((client) => (
                                <option
                                    key={client.memberId}
                                    value={client.memberId}
                                >
                                    {client.firstName ||
                                        client.name ||
                                        `Member #${client.memberId}`}
                                    {" — ID: "}
                                    {client.memberId}
                                </option>
                            ))}
                        </select>
                    </div>

                    {clients.length === 0 && (
                        <p>No assigned Members are available.</p>
                    )}

                    <div>
                        <label htmlFor="member-attendance-remarks">
                            Remarks (optional)
                        </label>

                        <textarea
                            id="member-attendance-remarks"
                            rows="3"
                            value={remarks}
                            onChange={(event) =>
                                setRemarks(event.target.value)
                            }
                            placeholder="Add attendance remarks..."
                        />
                    </div>

                    <Button
                        type="submit"
                        loading={actionLoading}
                        disabled={clients.length === 0}
                    >
                        Mark Attendance
                    </Button>
                </form>
            </Card>

            <Card
                title="My Working Attendance History"
                subtitle="Your records for the last 30 days."
            >
                {history.length === 0 ? (
                    <p>No attendance records found.</p>
                ) : (
                    <div className="attendance-table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Check In</th>
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
                                            {formatDateTime(record.checkOutTime)}
                                        </td>
                                        <td>{record.attendanceStatus}</td>
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
