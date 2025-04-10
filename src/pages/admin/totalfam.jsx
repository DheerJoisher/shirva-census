import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const TotalFamilies = () => {
    const [families, setFamilies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFamilies = async () => {
            try {
                // Fetch households with head of family information joined
                const { data, error } = await supabase
                    .from('HOUSEHOLD')
                    .select(`
                        household_id,
                        address,
                        chapter,
                        number_of_members,
                        head_of_family:head_of_family_id(
                            resident_id,
                            first_name,
                            middle_name,
                            last_name
                        )
                    `);

                if (error) throw error;
                setFamilies(data || []);
            } catch (err) {
                console.error('Error fetching families:', err);
                setError('Failed to load families');
            } finally {
                setLoading(false);
            }
        };

        fetchFamilies();
    }, []);

    if (loading) return <div>Loading families...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Total Families ({families.length})</h1>
            <table>
                <thead>
                    <tr>
                        <th>Household ID</th>
                        <th>Head of Family</th>
                        <th>Address</th>
                        <th>Chapter</th>
                        <th>Number of Members</th>
                    </tr>
                </thead>
                <tbody>
                    {families.map((family) => (
                        <tr key={family.household_id}>
                            <td>{family.household_id}</td>
                            <td>
                                {family.head_of_family 
                                    ? `${family.head_of_family.first_name} ${family.head_of_family.middle_name || ''} ${family.head_of_family.last_name}`
                                    : 'Not specified'}
                            </td>
                            <td>{family.address}</td>
                            <td>{family.chapter}</td>
                            <td>{family.number_of_members}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TotalFamilies;
