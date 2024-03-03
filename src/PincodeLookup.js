import React, { useState } from 'react';
import axios from 'axios';

function PincodeLookup() {
  const [pincode, setPincode] = useState('');
  const [filteredPostOffices, setFilteredPostOffices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPincodeDetails = async () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setError('Postal code must be 6 digits.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data[0].PostOffice;
      setFilteredPostOffices(data);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    }

    setIsLoading(false);
  };

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    const filteredData = filteredPostOffices.filter(
      (office) => office.Name.toLowerCase().includes(filterValue)
    );
    setFilteredPostOffices(filteredData);
  };

  return (
    <div>
      <h1>Enter Pincode</h1>
      <div>
        <input
          type="text"
          placeholder="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        /><br></br>
        <button onClick={fetchPincodeDetails}>Lookup</button>
      </div>
      {isLoading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        placeholder="Filter by post office name"
        onChange={handleFilterChange}
      />
      <ul>
        {filteredPostOffices.length > 0 ? (
          filteredPostOffices.map((office) => (
            <li key={office.Name}>
              <strong>Name:</strong> {office.Name} <br />
              <strong>Branch Type:</strong> {office.BranchType} <br />
              <strong>District:</strong> {office.District} <br />
              <strong>State:</strong> {office.State} <br />
            </li>
          ))
        ) : (
          <li>Couldn’t find the postal data you’re looking for...</li>
        )}
      </ul>
    </div>
  );
}

export default PincodeLookup;
