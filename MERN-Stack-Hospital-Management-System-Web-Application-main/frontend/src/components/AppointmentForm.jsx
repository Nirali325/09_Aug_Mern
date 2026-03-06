import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const departmentsArray = [
    "Pediatrics",
    "Dentist",
    "Cardiology",
    "Neurology",
    "Diagnostic",
    "Physiology",
    "Physical Therapy",
    "Dermatology",
    "Emergency",
  ];

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          hasVisited,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);

      // Reset Form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("Pediatrics");
      setHasVisited(false);
      setAddress("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <input placeholder="DOB"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input placeholder="Appointment Date"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
        </div>

        <div>
          <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => {
                  return (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  );
                })}
              </select>
        </div>

        <textarea
          rows="6"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
          <div className="checkbox-wrapper">
  <label>
    <input
      type="checkbox"
      checked={hasVisited}
      onChange={(e) => setHasVisited(e.target.checked)}
    />
    Have you visited before?
  </label>
</div>
        {/* <div
          style={{
            gap: "10px",
            justifyContent: "flex-end",
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: 0 }}>Have you visited before?</p>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.checked)}
            style={{ width: "20px" }}
          />
        </div> */}

        <button style={{ margin: "20px auto", display: "block" }}>
          GET APPOINTMENT
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;