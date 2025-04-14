import React, { useState, useEffect } from 'react';
import { Container, Table, Card, Form, InputGroup } from 'react-bootstrap';
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
        const { data, error } = await supabase
          .from('household')
          .select('*');

        if (error) throw error;

        setHouseholds(data);
        setFilteredHouseholds(data);

        // Extract unique chapters
        const uniqueChapters = [...new Set(data.map(house => house.chapter))];
        setChapters(uniqueChapters);
      } catch (err) {
        console.error('Error fetching households:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

  // Filter logic
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
