import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';
import { supabase } from '../../supabaseClient';

const Households = () => {
  const [households, setHouseholds] = useState([]);
  const [filteredHouseholds, setFilteredHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const { data: householdData, error: householdError } = await supabase
          .from('household')
          .select(`
            household_id,
            head_of_family_id,
            address,
            chapter,
            number_of_members
          `);

        if (householdError) throw householdError;

        const headIds = householdData
          .filter(h => h.head_of_family_id)
          .map(h => h.head_of_family_id);

        if (headIds.length > 0) {
          const { data: residentsData, error: residentsError } = await supabase
            .from('residents')
            .select('resident_id, first_name, middle_name, last_name')
            .in('resident_id', headIds);

          if (residentsError) throw residentsError;

          const transformedData = householdData.map(household => {
            const headOfFamily = residentsData.find(
              resident => resident.resident_id === household.head_of_family_id
            );
            
            return {
              id: household.household_id,
              head_of_family_id: household.head_of_family_id,
              head_of_family: headOfFamily 
                ? `${headOfFamily.first_name} ${headOfFamily.middle_name || ''} ${headOfFamily.last_name}`.trim().replace(/\s+/g, ' ')
                : 'Unknown',
              address: household.address,
              chapter: household.chapter,
              number_of_members: household.number_of_members
            };
          });

          setHouseholds(transformedData);
          setFilteredHouseholds(transformedData);

          const uniqueChapters = [...new Set(transformedData.map(house => house.chapter))];
          setChapters(uniqueChapters);
        } else {
          setHouseholds([]);
          setFilteredHouseholds([]);
          setChapters([]);
        }
      } catch (err) {
        console.error('Error fetching households:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

  useEffect(() => {
    const filtered = households.filter((household) => {
      const matchesSearch =
        (household.head_of_family || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (household.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (household.chapter || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesChapter =
        selectedChapter === '' || household.chapter === selectedChapter;

      return matchesSearch && matchesChapter;
    });

    setFilteredHouseholds(filtered);
  }, [searchTerm, selectedChapter, households]);

  return (
    <>
      <Navbar />
      
      <Container fluid className="px-0 bg-gray-100 min-vh-100">
        <div className="px-4 pt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Household Management</h1>
            </div>
          </div>

          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <Form.Control
                      placeholder="Search households..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <Form.Select 
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-full"
                  >
                    <option value="">All Chapters</option>
                    {chapters.map(chapter => (
                      <option key={chapter} value={chapter}>{chapter}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            {loading ? (
              <div className="text-center p-8">
                <Spinner animation="border" role="status" variant="primary" className="w-12 h-12">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-gray-500">Loading household data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table hover className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Head of Family
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chapter
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHouseholds.length > 0 ? (
                      filteredHouseholds.map((household, index) => (
                        <tr key={household.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-blue-600">{household.head_of_family}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{household.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {household.chapter}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No households found</h3>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                            <button
                              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => {setSearchTerm(''); setSelectedChapter('')}}
                            >
                              Reset filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </Container>
      
      <Footer />
    </>
  );
};

export default Households;