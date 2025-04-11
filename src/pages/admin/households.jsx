import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';

const Households = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapters, setChapters] = useState([]);
  
  // Fetch households data
  useEffect(() => {
    // Replace with actual API call
    const fetchHouseholds = async () => {
      try {
        // Simulate API call with dummy data
        setTimeout(() => {
          const dummyData = [
            { id: 1, headOfFamily: 'John Doe', address: '123 Main St, Shirva', chapter: 'East' },
            { id: 2, headOfFamily: 'Jane Smith', address: '456 Oak Ave, Shirva', chapter: 'West' },
            { id: 3, headOfFamily: 'Robert Johnson', address: '789 Pine Rd, Shirva', chapter: 'North' },
            { id: 4, headOfFamily: 'Emily Davis', address: '101 Cedar Ln, Shirva', chapter: 'South' },
            { id: 5, headOfFamily: 'Michael Wilson', address: '202 Maple Dr, Shirva', chapter: 'Central' },
          ];
          setHouseholds(dummyData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching households:', error);
        setLoading(false);
      }
    };

    fetchHouseholds();

    // Extract unique chapters for filter dropdown
    const fetchChapters = () => {
      const uniqueChapters = [...new Set(households.map(house => house.chapter))];
      setChapters(uniqueChapters);
    };

    if (!loading) {
      fetchChapters();
    }
  }, [households, loading]);

  // Filter households based on search term and selected chapter
  const filteredHouseholds = households.filter(household => {
    const matchesSearch = 
      household.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.chapter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChapter = selectedChapter === '' || household.chapter === selectedChapter;
    
    return matchesSearch && matchesChapter;
  });

  return (
    <>
      <Navbar />
      
      <Container className="py-4">
        <Card>
          <Card.Header as="h5" className="bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>Households</div>
              <div className="d-flex w-50">
                <InputGroup className="me-2">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search households..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Form.Select 
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  <option value="">All Chapters</option>
                  {chapters.map(chapter => (
                    <option key={chapter} value={chapter}>{chapter}</option>
                  ))}
                </Form.Select>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center">Loading households...</div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Head of Family</th>
                    <th>Address</th>
                    <th>Chapter</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHouseholds.length > 0 ? (
                    filteredHouseholds.map((household, index) => (
                      <tr key={household.id}>
                        <td>{index + 1}</td>
                        <td>{household.headOfFamily}</td>
                        <td>{household.address}</td>
                        <td>{household.chapter}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">No households found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
      
      <Footer />
    </>
  );
};

export default Households;
