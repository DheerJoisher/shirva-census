import React, { useState } from 'react';
import Navbar from '../../components/user/navbar';
import Footer from '../../components/user/footer';

const FamilyDetails = () => {
  // State for form inputs
  const [address, setAddress] = useState('');
  const [chapter, setChapter] = useState('');
  
  // State for family members list
  const [familyMembers, setFamilyMembers] = useState([]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would fetch data from an API here
    // For demo purposes, we'll just add some dummy data
    setFamilyMembers([
      { id: 1, name: 'John Doe', age: 35, relation: 'Self' },
      { id: 2, name: 'Jane Doe', age: 32, relation: 'Spouse' },
      { id: 3, name: 'Jimmy Doe', age: 10, relation: 'Child' },
    ]);
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Family Details</h1>
        
        {/* Form for address and chapter */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your address"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="chapter" className="block mb-2 font-medium">Chapter</label>
            <input
              type="text"
              id="chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your chapter"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        
        {/* Family members list */}
        {familyMembers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Family Members</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border text-left">Name</th>
                    <th className="py-2 px-4 border text-left">Age</th>
                    <th className="py-2 px-4 border text-left">Relation</th>
                  </tr>
                </thead>
                <tbody>
                  {familyMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="py-2 px-4 border">{member.name}</td>
                      <td className="py-2 px-4 border">{member.age}</td>
                      <td className="py-2 px-4 border">{member.relation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FamilyDetails;
