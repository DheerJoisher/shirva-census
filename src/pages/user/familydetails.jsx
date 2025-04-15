import React, { useState, useEffect } from 'react';
import Navbar from '../../components/user/navbar';
import Footer from '../../components/user/footer';
import { supabase } from '../../supabaseClient';

const FamilyDetails = () => {
  const [address, setAddress] = useState('');
  const [chapter, setChapter] = useState('');
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const householdId = localStorage.getItem('household_id');

  useEffect(() => {
    const fetchData = async () => {
      if (!householdId) {
        console.warn('No household ID found in localStorage');
        setLoading(false);
        return;
      }

      try {
        // Fetch family members
        const { data: members, error: membersError } = await supabase
          .from('residents')
          .select('resident_id, first_name, last_name, date_of_birth, relation')
          .eq('household_id', householdId);

        if (membersError) throw membersError;
        setFamilyMembers(members || []);

        // Fetch household address and chapter
        const { data: household, error: householdError } = await supabase
          .from('household')
          .select('address, chapter')
          .eq('household_id', householdId)
          .single();

        if (householdError) throw householdError;

        setAddress(household.address || '');
        setChapter(household.chapter || '');
      } catch (err) {
        console.error('Error fetching data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [householdId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('household')
        .update({ address, chapter })
        .eq('household_id', householdId);

      if (error) throw error;

      alert('Household details updated successfully');
    } catch (err) {
      console.error('Error updating household:', err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Family Details</h1>

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
            <select
              id="chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="" disabled>Select your chapter</option>
              <option value="Chapter 1">Mulund-Ghatkopar</option>
              <option value="Chapter 2">Western Chapter</option>
              <option value="Chapter 3">Kutchh Chapter</option>
              <option value="Chapter 4">Vapi-Valsad Chapter</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>

        {loading ? (
          <div className="text-center">Loading family members...</div>
        ) : familyMembers.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Family Members</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border text-left">First Name</th>
                    <th className="py-2 px-4 border text-left">Last Name</th>
                    <th className="py-2 px-4 border text-left">Date of Birth</th>
                    <th className="py-2 px-4 border text-left">Relation</th>
                  </tr>
                </thead>
                <tbody>
                  {familyMembers.map((member) => (
                    <tr key={member.resident_id}>
                      <td className="py-2 px-4 border">{member.first_name}</td>
                      <td className="py-2 px-4 border">{member.last_name}</td>
                      <td className="py-2 px-4 border">{member.date_of_birth}</td>
                      <td className="py-2 px-4 border">{member.relation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center">No family members found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FamilyDetails;
