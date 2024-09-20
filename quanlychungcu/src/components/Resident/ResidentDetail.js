import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './ResidentDetail.css'; // Ensure you create this CSS file for custom styles

const ResidentDetail = () => {
    const { id } = useParams(); // Get ID from URL
    const api = authApi();
    const [resident, setResident] = useState(null);

    useEffect(() => {
        const fetchResidentDetail = async () => {
            try {
                const response = await api.get(endpoints.residentDetail(id));
                setResident(response.data);
            } catch (error) {
                console.error('Error fetching resident detail:', error.response?.data || error.message);
            }
        };

        fetchResidentDetail();
    }, [id]);

    if (!resident) return <div>Loading...</div>;

    return (
        <>
            <CustomNavbar />
            <div className="resident-detail-container">
                <div className="resident-card">
                    <div className="resident-header">
                        <img className="resident-avatar" src={resident.avatar_url} alt={`${resident.first_name}'s avatar`} />
                        <h1 className="resident-name">{resident.first_name} {resident.last_name}</h1>
                        <span className="resident-verify">✔ Verified</span>
                    </div>
                    <div className="resident-info">
                        <div className="resident-left">
                            <p className="resident-full-name"><strong>Họ người dùng: </strong> {resident.first_name}</p>
                            <p className="resident-full-name"><strong>Tên người dùng: </strong>{resident.last_name}</p>
                            <p className="resident-phone"><strong>Số điện thoại: </strong>{resident.phone}</p>
                        </div>
                        <div className="resident-right">
                            <p className="resident-username"><strong>Tên tài khoản: </strong>{resident.username}</p>
                            <p className="resident-email"><strong>Email: </strong>{resident.email}</p>                          
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ResidentDetail;
