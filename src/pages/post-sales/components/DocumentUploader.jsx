import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, CheckCircle, X } from 'lucide-react';
import { usePostSales } from '../../../context/PostSalesContext';

const DOC_TYPES = ['KYC', 'GST', 'PAN', 'Agreement', 'Invoice', 'Other'];

const DocumentUploader = ({ customerId, onUploaded }) => {
    const { addDocument } = usePostSales();
    const [docType, setDocType] = useState('KYC');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(file => {
            const newDoc = {
                customerId,
                name: file.name,
                type: docType,
                status: 'submitted',
                uploadedAt: new Date().toISOString(),
            };
            addDocument(newDoc);
            setUploadedFiles(prev => [...prev, { name: file.name, type: docType }]);
            if (onUploaded) onUploaded(newDoc);
        });
    }, [docType, customerId, addDocument, onUploaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.jpg', '.jpeg', '.png'],
            'application/msword': ['.doc', '.docx']
        },
        multiple: false,
    });

    return (
        <div className="space-y-3">
            {/* Doc Type Selector */}
            <div className="flex flex-wrap gap-2">
                {DOC_TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => setDocType(type)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${docType === type
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30'}`}
            >
                <input {...getInputProps()} />
                <motion.div
                    animate={{ scale: isDragActive ? 1.1 : 1 }}
                    className="flex flex-col items-center gap-2"
                >
                    <Upload className={`w-8 h-8 ${isDragActive ? 'text-indigo-500' : 'text-gray-300'}`} />
                    <p className="text-sm font-medium text-gray-600">
                        {isDragActive ? 'Drop to upload' : 'Drag & drop or click to select'}
                    </p>
                    <p className="text-xs text-gray-400">Supported: PDF, JPG, PNG, DOC</p>
                </motion.div>
            </div>

            {/* Uploaded files */}
            <AnimatePresence>
                {uploadedFiles.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2"
                    >
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <File className="w-4 h-4 text-gray-400 shrink-0" />
                        <p className="text-xs text-gray-700 font-medium truncate flex-1">{f.name}</p>
                        <span className="text-xs text-emerald-600 font-semibold shrink-0">{f.type}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default DocumentUploader;
