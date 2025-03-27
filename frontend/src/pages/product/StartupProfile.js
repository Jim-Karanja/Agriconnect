import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function App() {
  const [startupList, setStartupList] = useState([]);
  const [startupData, setStartupData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    website: "",
    description: "",
    industries: "",
    locations: "",
    amountRaised: "",
    fundingDuration: "",
  });

  const [message, setMessage] = useState("");

  // Fetch startup data from the server
  useEffect(() => {
    socket.emit("get_startups"); // Emit "get_startups" event when the component mounts

    // Listen for the response and update the list
    socket.on("startups_data", (data) => {
      setStartupList(data.startups);
    });

    // Listen for new startups added and append to the list
    socket.on("new_startup", (data) => {
      setStartupList((prevList) => [...prevList, data.startup]);
    });

    // Cleanup event listeners on unmount
    return () => {
      socket.off("startups_data");
      socket.off("new_startup");
    };
  }, []);

  const handleSelectStartup = (startupId) => {
    setStartupData(startupList.find((startup) => startup._id === startupId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("add_startup", formData);
    setMessage("Startup added successfully!");
    setFormData({
      name: "",
      photo: "",
      website: "",
      description: "",
      industries: "",
      locations: "",
      amountRaised: "",
      fundingDuration: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
      {/* Form Section */}
      <div style={{ flex: 1, marginRight: "20px" }}>
        <h1 style={{ color: "brown", textTransform: "" }}>Agrinetwork Startups</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="text"
            name="photo"
            placeholder="Photo URL"
            value={formData.photo}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", height: "150px", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="text"
            name="industries"
            placeholder="Industries"
            value={formData.industries}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="text"
            name="locations"
            placeholder="Locations"
            value={formData.locations}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="text"
            name="amountRaised"
            placeholder="Amount Raised"
            value={formData.amountRaised}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <input
            type="text"
            name="fundingDuration"
            placeholder="Funding Duration"
            value={formData.fundingDuration}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "10px", padding: "10px", fontSize: "16px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Startup
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>

      <div style={{ flex: 1 }}>
  <h3 style={{ color: 'brown', fontSize: '24px' }}>Startups</h3>
  {startupList.map((startup) => (
    <div
      key={startup._id}
      onClick={() => handleSelectStartup(startup._id)}
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      <h4
        style={{
          backgroundColor: 'chocolate', // Chocolate color
          color: 'black',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '15px',
          textAlign: 'center',
          cursor: 'pointer',
          textTransform: 'uppercase', // Make text uppercase
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#D2691E')} // Darker chocolate on hover
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'chocolate')} // Reset chocolate on mouse leave
      >
        {startup.name}
      </h4>
      <p style={{ fontSize: '18px', color: 'gray' }}>{startup.description}</p> {/* Increased font size for description */}
    </div>
  ))}
</div>



      {/* Selected Startup Details */}
{startupData && (
  <div style={{ flex: 1, marginLeft: "20px" }}>
    <h4 style={{ color: "green", fontSize: "20px" }}>Details for {startupData.name}</h4>
    <p>{startupData.description}</p>
    <p>
      <strong>Website:</strong> <a href={startupData.website} style={{ color: "green" }}>{startupData.website}</a>
    </p>
  </div>
)}

    
    </div>
  );
}

export default App;
