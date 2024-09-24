import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import 'tailwindcss/tailwind.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [seed, setSeed] = useState(123); // Default seed value
  const [errors, setErrors] = useState(0); // Number of errors per record
  const [region, setRegion] = useState('USA'); // Region selection

  // Set faker locale based on region
  const setFakerLocale = (region) => {
    switch (region) {
      case 'USA':
        faker.locale = 'en_US';
        break;
      case 'Poland':
        faker.locale = 'pl';
        break;
      case 'Georgia':
        faker.locale = 'ka';
        break;
      default:
        faker.locale = 'en'; // Default to English
    }
  };

  // Error simulation helper function
  const introduceError = (text) => {
    const errorTypes = ['delete', 'add', 'swap'];
    let errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    let textArr = text.split('');

    if (errorType === 'delete' && textArr.length > 1) {
      const randomIndex = Math.floor(Math.random() * textArr.length);
      textArr.splice(randomIndex, 1); // Delete random character
    } else if (errorType === 'add') {
      const randomIndex = Math.floor(Math.random() * textArr.length);
      const randomChar = faker.string.alpha({ count: 1 }); // Add random character
      textArr.splice(randomIndex, 0, randomChar);
    } else if (errorType === 'swap' && textArr.length > 1) {
      const randomIndex = Math.floor(Math.random() * (textArr.length - 1));
      [textArr[randomIndex], textArr[randomIndex + 1]] = [textArr[randomIndex + 1], textArr[randomIndex]];
    }

    return textArr.join('');
  };

  // Generate fake users
  const generateFakeUsers = (count = 20) => {
    setFakerLocale(region); // Set the locale based on region
    faker.seed(seed); // Reset the seed each time to ensure consistency

    const fakeUsers = [];

    for (let i = 0; i < count; i++) {
      let name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      let address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`;
      let phone = faker.phone.number();

      // Introduce errors based on slider value
      if (errors > 0) {
        if (Math.random() < errors / 10) {
          name = introduceError(name);
        }
        if (Math.random() < errors / 10) {
          address = introduceError(address);
        }
        if (Math.random() < errors / 10) {
          phone = introduceError(phone);
        }
      }

      fakeUsers.push({
        id: faker.string.uuid(),
        name,
        address,
        phone,
      });
    }

    return fakeUsers;
  };

  // Trigger onChange for seed, errors, and region
  useEffect(() => {
    const usersData = generateFakeUsers();
    setUsers(usersData);
  }, [seed, errors, region]); // Watches for changes in seed, errors, and region

  // Handle seed change
  const handleSeedChange = (e) => {
    setSeed(parseInt(e.target.value, 10));
  };

  // CSV export function
  const downloadCSV = () => {
    const csvData = users.map(user => ({
      id: user.id,
      name: user.name,
      address: user.address,
      phone: user.phone,
    }));

    const csvContent = [
      ['ID', 'Name', 'Address', 'Phone'],
      ...csvData.map(row => [row.id, row.name, row.address, row.phone]),
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user_data.csv";
    link.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Random User Generator</h1>

      <div className="mb-4">
        <label className="block text-gray-700">Seed value:</label>
        <input
          type="number"
          value={seed}
          onChange={handleSeedChange}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Number of errors (0-10):</label>
        <input
          type="range"
          min="0"
          max="10"
          value={errors}
          onChange={(e) => setErrors(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <span>{errors}</span>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Region:</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="USA">USA</option>
          <option value="Poland">Poland</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>

      <button
        onClick={downloadCSV}
        className="mb-4 bg-blue-500 text-white p-2 rounded"
      >
        Download Data as CSV
      </button>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.address}</td>
              <td className="border px-4 py-2">{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
