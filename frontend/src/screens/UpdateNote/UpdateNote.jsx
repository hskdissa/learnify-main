import React, { useState } from 'react';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import axios from 'axios';

const UploadNotes = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percentage = Math.floor((loaded * 100) / total);
                    setProgress(percentage);
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setNotes(data.notes); // Store the generated notes from the response
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('File upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Upload Notes</h3>
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
            <Button onClick={handleFileUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Notes'}
            </Button>

            {loading && <ProgressBar animated now={progress} />}
            {loading && <Spinner animation="border" />}
            {notes && <div><h4>Generated Notes</h4><p>{notes}</p></div>}
        </div>
    );
};

export default UploadNotes;
