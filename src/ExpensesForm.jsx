import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function AppointmentForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get("https://u8svo1-4000.csb.app/users/ac");
      setData(response.data);
      console.log("getdata", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = { name, amount, description };
    try {
      if (editMode) {
        await axios.put(
          `https://u8svo1-4000.csb.app/users/update/${editId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMessage("Appointment updated successfully!");
        setEditMode(false);
      } else {
        await axios.post("https://u8svo1-4000.csb.app/users", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setMessage("Appointment submitted successfully!");
      }
      getData();
      setName("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.log(error);
      setMessage("Error");
    }
  };

  const handleEdit = (id) => {
    const appointment = data.find((user) => user.id === id);
    setName(appointment.name);
    setAmount(appointment.amount);
    setDescription(appointment.description);
    setEditMode(true);
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://u8svo1-4000.csb.app/users/delete/${id}`);
      setMessage("Appointment deleted successfully!");
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <br />
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <br />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <br />
          <button type="submit">{editMode ? "Update" : "Submit"}</button>

          <br />
        </form>
        {message && <p>{message}</p>}
      </div>
      {data && (
        <div className="list-container">
          <ul>
            {data.map((user) => (
              <li key={user.id}>
                <p>{user.id}</p>

                <p>{user.name}</p>
                <p>{user.amount}</p>
                <p> {user.description}</p>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default AppointmentForm;
