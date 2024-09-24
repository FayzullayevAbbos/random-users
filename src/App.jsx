import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import 'tailwindcss/tailwind.css';

const App = () => {
  const [allUsers, setAllUsers] = useState([]); // Barcha foydalanuvchilar
  const [displayedUsers, setDisplayedUsers] = useState([]); // Ko'rsatilayotgan foydalanuvchilar
  const [seed, setSeed] = useState(123);
  const [errors, setErrors] = useState(0);
  const [region, setRegion] = useState('USA');

  // Foydalanuvchi ma'lumotlarini yaratish
  const generateFakeUsers = (count = 90) => {
    const fakeUsers = [];
    const regions = ['USA', 'Poland', 'Georgia'];

    for (let i = 0; i < count; i++) {
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      const address = `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`;
      const phone = faker.phone.number();
      const id = faker.string.uuid();

      fakeUsers.push({
        id,
        name,
        address,
        phone,
        region: randomRegion,
      });
    }

    return fakeUsers;
  };

  // Xatolarni kiritish
  const introduceError = (text) => {
    const errorTypes = ['delete', 'add', 'swap'];
    let errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
    let textArr = text.split('');

    if (errorType === 'delete' && textArr.length > 1) {
      const randomIndex = Math.floor(Math.random() * textArr.length);
      textArr.splice(randomIndex, 1);
    } else if (errorType === 'add') {
      const randomIndex = Math.floor(Math.random() * textArr.length);
      const randomChar = faker.string.alpha({ count: 1 });
      textArr.splice(randomIndex, 0, randomChar);
    } else if (errorType === 'swap' && textArr.length > 1) {
      const randomIndex = Math.floor(Math.random() * (textArr.length - 1));
      [textArr[randomIndex], textArr[randomIndex + 1]] = [textArr[randomIndex + 1], textArr[randomIndex]];
    }

    return textArr.join('');
  };

  // Dastlabki foydalanuvchilarni yaratish va o'rnatish
  useEffect(() => {
    const usersData = generateFakeUsers(); // 90 ta foydalanuvchini yaratamiz
    setAllUsers(usersData); // Barcha foydalanuvchilarni o'rnatamiz
    setDisplayedUsers(usersData.filter(user => user.region === region)); // Dastlabki region bo'yicha ko'rsatilayotgan foydalanuvchilarni o'rnatamiz
  }, []);

  // Mintaqa o'zgarganda ko'rsatilayotgan foydalanuvchilarni yangilash
  useEffect(() => {
    const filteredUsers = allUsers.filter(user => user.region === region);
    const updatedUsers = filteredUsers.map(user => {
      let name = user.name;
      let address = user.address;
      let phone = user.phone;

      // Xatolarni qo'shish
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

      return { ...user, name, address, phone }; // ID o'zgarmasligini ta'minlaymiz
    });
    setDisplayedUsers(updatedUsers); // Yangilangan foydalanuvchilarni o'rnatamiz
    
  }, [region, errors, allUsers]);
  useEffect(()=> {
setErrors(0)
  },[seed , region])

  // Seedni o'zgartirish
  const handleSeedChange = (e) => {
    setSeed(parseInt(e.target.value, 10));
  };

  // Xatolar sonini o'zgartirish
  const handleErrorsChange = (e) => {
    setErrors(parseInt(e.target.value, 10));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tasodifiy Foydalanuvchi Generatori</h1>

      <div className="mb-4">
        <label className="block text-gray-700">Seed qiymati:</label>
        <input
          type="number"
          value={seed}
          onChange={handleSeedChange}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Xatolar soni (0-10):</label>
        <input
          type="range"
          min="0"
          max="10"
          value={errors}
          onChange={handleErrorsChange}
          className="w-full"
        />
        <span>{errors}</span>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Mintaqa:</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="USA">AQSh</option>
          <option value="Poland">Polsha</option>
          <option value="Georgia">Gruziya</option>
        </select>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Ism</th>
            <th className="border px-4 py-2">Manzil</th>
            <th className="border px-4 py-2">Telefon</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user, index) => (
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
