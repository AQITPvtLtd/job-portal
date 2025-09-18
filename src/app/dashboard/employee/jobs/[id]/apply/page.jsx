import ApplyForm from './ApplyForm';
import JobDetails from '../JobDetails';
import React from 'react'

const page = ({ params }) => {
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <JobDetails id={params.id} />
            <ApplyForm jobId={params.id} />
        </div>
    );
}

export default page