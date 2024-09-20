import React, { useEffect, useState } from 'react';
import { Button, Table, ButtonGroup, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './SurveyList.css';

const SurveyList = () => {
    const [surveys, setSurveys] = useState([]);
    const [surveyResults, setSurveyResults] = useState([]);
    const [selectedSurveyId, setSelectedSurveyId] = useState(null);
    const [loadingSurveys, setLoadingSurveys] = useState(true);
    const [loadingResults, setLoadingResults] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editResult, setEditResult] = useState(null);
    const [newSurvey, setNewSurvey] = useState({
        title: '',
        description: ''
    });

    // Fetch all surveys
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const api = authApi();
                const response = await api.get(endpoints.survey);
                setSurveys(response.data);
            } catch (err) {
                setError('Failed to fetch surveys');
            } finally {
                setLoadingSurveys(false);
            }
        };

        fetchSurveys();
    }, []);

    // Fetch survey results based on selected survey
    useEffect(() => {
        if (selectedSurveyId) {
            const fetchSurveyResults = async () => {
                setLoadingResults(true);
                try {
                    const api = authApi();
                    const response = await api.get(endpoints.surveyresult);
                    const results = response.data.filter(result => result.survey === parseInt(selectedSurveyId));
                    setSurveyResults(results);
                } catch (err) {
                    setError('Failed to fetch survey results');
                } finally {
                    setLoadingResults(false);
                }
            };

            fetchSurveyResults();
        } else {
            setSurveyResults([]);
        }
    }, [selectedSurveyId]);

    const handleSurveySelection = (event) => {
        setSelectedSurveyId(event.target.value);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            try {
                const api = authApi(); // Đảm bảo sử dụng API đã xác thực
                await api.delete(endpoints.deleteResult(id));
                setSurveyResults(surveyResults.filter(result => result.id !== id));
            } catch (error) {
                console.error('Failed to delete result:', error);
                setError('Failed to delete result');
            }
        }
    };
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const api = authApi(); // Đảm bảo sử dụng API đã xác thực
            if (editResult.id) {
                // Cập nhật kết quả khảo sát
                await api.patch(endpoints.updateResult(editResult.id), editResult);
            } else {
                // Nếu không có editResult.id, bạn có thể thêm logic cho việc tạo mới
                await api.post(endpoints.createResult, editResult);
            }
    
            // Cập nhật danh sách kết quả khảo sát sau khi lưu
            const response = await api.get(endpoints.surveyresult);
            setSurveyResults(response.data.filter(result => result.survey === parseInt(selectedSurveyId)));
            setShowModal(false);
            setEditResult(null);
        } catch (error) {
            console.error('Error saving result:', error);
            setError('Error saving result');
        }
    };
    
    const handleCreateSurvey = async (e) => {
        e.preventDefault();
        try {
            const api = authApi(); // Ensure to use the authenticated API
            const response = await api.post(endpoints.createSurvey, { 
                title: newSurvey.title,
                creator: authApi().defaults.headers.common['Authorization'] // Add creator field with user info
            });
            const surveyResponse = await api.get(endpoints.survey);
            setSurveys(surveyResponse.data); // Update surveys list
            setShowModal(false);
            setNewSurvey({ title: '' }); // Reset the form
        } catch (error) {
            console.error('Error creating survey:', error);
            setError('Error creating survey');
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="container2">
                <h1 className="title-result text-primary">DANH SÁCH KẾT QUẢ KHẢO SÁT</h1>
                {loadingSurveys ? (
                    <Spinner animation="border" />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : surveys.length > 0 ? (
                    <div className="choose">
                        <Form.Select onChange={handleSurveySelection} value={selectedSurveyId || ''}>
                            <option value="">--- Chọn khảo sát ---</option>
                            {surveys.map(survey => (
                                <option key={survey.id} value={survey.id}>
                                    {survey.title}
                                </option>
                            ))}
                        </Form.Select>
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditResult(null); // Clear any previous result data
                                setShowModal(true);  // Show modal for creating survey
                            }}
                        >
                            <AddIcon /> Tạo khảo sát
                        </Button>
                    </div>
                ) : (
                    <p>Không có kết quả khảo sát nào</p>
                )}

                {selectedSurveyId && (
                    <div className="addSurvey mt-4">
                        {loadingResults ? (
                            <Spinner animation="border" />
                        ) : surveyResults.length > 0 ? (
                            <div className="table-container2 mt-3">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Cư dân</th>
                                            <th>Vệ sinh</th>
                                            <th>Cơ sở vật chất</th>
                                            <th>Dịch vụ</th>
                                            <th>Ngày thực hiện</th>
                                            <th>Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {surveyResults.map(result => (
                                            <tr key={result.id}>
                                                <td>{result.first_name} {result.last_name}</td>
                                                <td>{result.cleanliness_rating}</td>
                                                <td>{result.facilities_rating}</td>
                                                <td>{result.services_rating}</td>
                                                <td>{new Date(result.submitted_at).toLocaleString()}</td>
                                                <td>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant="warning"
                                                            onClick={() => {
                                                                setEditResult(result);
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </Button>
                                                        <Button variant="danger" onClick={() => handleDelete(result.id)} >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <p>Không có cư dân nào thực hiện khảo sát.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Edit/Add Result / Create Survey Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editResult ? (editResult.id ? 'Edit Result' : 'Add New Result') : 'Create New Survey'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editResult ? (
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group controlId="cleanliness_rating">
                                <Form.Label>Vệ sinh</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={editResult?.cleanliness_rating || ''}
                                    onChange={(e) => setEditResult({ ...editResult, cleanliness_rating: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="facilities_rating">
                                <Form.Label>Cơ sở vật chất</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={editResult?.facilities_rating || ''}
                                    onChange={(e) => setEditResult({ ...editResult, facilities_rating: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="services_rating">
                                <Form.Label>Dịch vụ</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={editResult?.services_rating || ''}
                                    onChange={(e) => setEditResult({ ...editResult, services_rating: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Save
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleCreateSurvey}>
                           
                            <Form.Group controlId="title">
                                <Form.Label>Tên khảo sát</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newSurvey.title}
                                    onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Tạo khảo sát
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SurveyList;
