import React from 'react';

const NearestUsersList = ({ users, type }) => {
  if (!users || users.length === 0) {
    return <div className="text-center text-gray-500">No nearest {type} found.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-semibold mb-2">Nearest {type === 'farmers' ? 'Farmers' : 'Customers'}</h3>
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user._id} className="py-3 flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">{user.address || 'Address not provided'}</p>
              {/* Assuming distance is calculated and added to user object in frontend or backend */}
              {user.distance && <p className="text-sm text-gray-600">{user.distance.toFixed(2)} km away</p>}
            </div>
            {/* Add more user details or actions here if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearestUsersList;
