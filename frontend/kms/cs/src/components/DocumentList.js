import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DocumentList.css';

let debounceTimer;

function DocumentList() {
    const { categoryId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState('');

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/routes/document/${categoryId}/documents`);
                console.log('Documents fetched:', response.data);
                setDocuments(response.data);
                setFilteredDocuments(response.data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [categoryId]);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (!query) {
                setFilteredDocuments(documents);
                return;
            }
            searchDocuments(query);
        }, 300);
    };

    const searchDocuments = (query) => {
        const lowerCaseQuery = query.toLowerCase();
        const filtered = documents.filter((doc) =>
            doc.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredDocuments(filtered);
    };

    const handlePreview = (doc) => {
        const previewUrl = `http://localhost:5000/routes/document/preview/${doc.fileId}`;
        setPreviewUrl(previewUrl);

        if (doc.mimeType.includes('pdf')) {
            setPreviewType('pdf');
        } else if (doc.mimeType.includes('image')) {
            setPreviewType('image');
        } else if (doc.mimeType.includes('video')) {
            setPreviewType('video');
        } else {
            setPreviewType('unknown');
        }
    };

    return (
        <div className="document-list-container">
            <h1>Document List</h1>

            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search documents..."
                />
            </div>

            {loading ? (
                <p className="loading-text">Loading documents...</p>
            ) : (
                <div className="document-grid">
                    {filteredDocuments.map((doc) => (
                        <div key={doc._id} className="document-card">
                            <span className="document-name">{doc.name}</span>
                            <button className="preview-btn" onClick={() => handlePreview(doc)}>Preview</button>
                        </div>
                    ))}
                </div>
            )}

            {previewUrl && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Document Preview</h2>
                        {previewType === 'pdf' && (
                            <iframe
                                src={previewUrl}
                                title="Document Preview"
                                width="100%"
                                height="500px"
                            />
                        )}
                        {previewType === 'image' && (
                            <img
                                src={previewUrl}
                                alt="Document Preview"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        )}
                        {previewType === 'video' && (
                            <video controls width="100%" height="auto">
                                <source src={previewUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        {previewType === 'unknown' && <p>Cannot preview this file type.</p>}
                        <button className="close-preview-btn" onClick={() => setPreviewUrl(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentList;
