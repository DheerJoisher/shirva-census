import React, { useState, useEffect } from 'react';
import Navbar from '../../components/admin/navbar';
import Footer from '../../components/admin/footer';
import { supabase } from '../../supabaseClient';

const Approvals = () => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('pending_users')
                .select('*');
            
            if (error) throw error;
            setApprovals(data);
        } catch (err) {
            setError('Error fetching pending users: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            // Get the user data
            const { data: userData, error: fetchError } = await supabase
                .from('pending_users')
                .select('*')
                .eq('id', id)
                .single();
            
            if (fetchError) throw fetchError;
            
            // First, create the user in Supabase Auth (normally would be done here)
            // For this example, we'll simulate by generating a UUID
            const user_id = crypto.randomUUID();
            
            // Then add the user to the users table
            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    user_id,
                    resident_id: null, // Would need to create resident first
                    
                    role: 'user'
                }]);
            
            if (insertError) throw insertError;
            
            // Delete from pending_users table
            const { error: deleteError } = await supabase
                .from('pending_users')
                .delete()
                .eq('id', id);
            
            if (deleteError) throw deleteError;
            
            // Update the local state
            setApprovals(approvals.filter(approval => approval.id !== id));
            alert(`User ${userData.first_name} ${userData.last_name} has been approved.`);
            
        } catch (err) {
            setError('Error accepting user: ' + err.message);
            console.error(err);
        }
    };

    const handleReject = async (id) => {
        try {
            // Delete from pending_users table
            const { error } = await supabase
                .from('pending_users')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            // Update the local state
            setApprovals(approvals.filter(approval => approval.id !== id));
            alert(`User request rejected and removed from the system.`);
            
        } catch (err) {
            setError('Error rejecting user: ' + err.message);
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ 
                padding: '20px', 
                fontFamily: 'Arial, sans-serif',
                minHeight: 'calc(100vh - 200px)' // Ensure minimum height between navbar and footer
            }}>
                <h1>Pending Approvals</h1>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {loading ? (
                    <p>Loading pending approvals...</p>
                ) : approvals.length === 0 ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '50px 0',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '8px',
                        marginTop: '30px'
                    }}>
                        <svg 
                            style={{ width: '80px', height: '80px', marginBottom: '20px', color: '#888' }}
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4"></path>
                            <path d="M12 16h.01"></path>
                        </svg>
                        <h2 style={{ color: '#555', margin: '0 0 10px 0' }}>No Pending Approvals</h2>
                        <p style={{ color: '#777', textAlign: 'center' }}>There are currently no user registration requests awaiting approval.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Registered At</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvals.map(({ id, first_name, last_name, email, phone_number, registered_at }) => (
                                <tr key={id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{first_name} {last_name}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{email}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{phone_number}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {new Date(registered_at).toLocaleString()}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <button 
                                            onClick={() => handleAccept(id)} 
                                            style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleReject(id)} 
                                            style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Approvals;
