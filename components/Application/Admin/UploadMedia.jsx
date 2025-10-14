"use client";
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { CldUploadWidget } from 'next-cloudinary';
import { FaCloudUploadAlt } from "react-icons/fa";

function UploadMedia({ isMultiple, queryClient }) {

    const handleOnError = (error) => {
        showToast('error', error.statusText)

    }

    const handleOnQueuesEnd = async (results) => {
        const files = results.info.files;
        const uploadedFiles = files.filter(file => file.uploadInfo).map(file => ({
            asset_id: file.uploadInfo.asset_id,
            public_id: file.uploadInfo.public_id,
            secure_url: file.uploadInfo.secure_url,
            path: file.uploadInfo.path,
            thumbnail_url: file.uploadInfo.thumbnail_url,
        }))

        if (uploadedFiles.length > 0) {
            try {
                const { data: MediaUploaResponse } = await axios.post('/api/media/create', uploadedFiles)
                if (!MediaUploaResponse.success) {
                    throw new Error(MediaUploaResponse.message)
                }
                queryClient.invalidateQueries(['media-data'])
                showToast('success', MediaUploaResponse.message)
            } catch (error) {
                showToast('error', error)
            }
        }
    }

    return (
        <CldUploadWidget
            signatureEndpoint='/api/cloudinary-signature'
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onQueuesEnd={handleOnQueuesEnd}
            config={{
                cloud: {
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
                }
            }}
            options={{
                sources: ['local', 'url', 'unsplash', 'google_drive'],
                multiple: isMultiple,
                // maxFiles: 5
            }}
        >

            {({ open }) => {
                return (
                    <Button onClick={() => open()}>
                        <FaCloudUploadAlt />
                        Upload Media
                    </Button>
                );
            }}

        </CldUploadWidget>
    )
}

export default UploadMedia;