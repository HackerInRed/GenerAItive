import React from 'react';
import Layout from '../components/Layout';
import { UploadProcessor } from '../components/upload/UploadProcessor';

const Upload = () => {
  return (
    <Layout fullWidth>
      <div className="bg-gradient-to-b from-vidsmith-darker to-black flex items-center justify-center">
        <UploadProcessor />
      </div>
    </Layout>
  );
};

export default Upload;