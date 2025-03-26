import React, { useEffect, useState } from "react";

function Customer() {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.pathname.split("/").slice(-1)[0]);
    const userId = urlParams; // Grab the userId from the URL

    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/customer/${userId}`);
        const data = await response.json();
        setCustomer(data);
      } catch (err) {
        console.error("Error fetching customer data:", err);
      }
    };

    if (userId) {
      fetchCustomer();
    }
  }, []);

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h2>Customer Details</h2>
      <div>
        <p>Name: {customer.name}</p>
        <p>Email: {customer.email}</p>
        <p>Phone: {customer.phoneNumber}</p>
        <p>Address: {customer.address}</p>
        <p>About: {customer.about}</p>
        <img src={customer.image_url} alt={customer.name} />
      </div>
    </div>
  );
}

export default Customer;
