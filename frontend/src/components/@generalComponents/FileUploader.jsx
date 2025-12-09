import React from 'react';
import Dropzone from 'react-dropzone';

const FileUploader = ({
  containerClass,
  label,
  title,
  onFileAdded,
  subtitle,
  maxFileSize,
  acceptedFileTypes,
  multiple,
  showPlaceholderIcon = true
}) => {

  return (
    <div className='mb-3'>
      {label && <label className='input-label'>{label}</label>}
      <Dropzone
        maxFileSize={maxFileSize}
        accept={acceptedFileTypes}
        onDrop={onFileAdded}
        multiple={multiple}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className={`dropzone-container ${containerClass}`} {...getRootProps()}>
              <input accept='.png, .jpg' {...getInputProps()} />
              <div>
                {showPlaceholderIcon &&
                  <div className=' d-flex justify-content-center'>
                    <img src='/images/image-icon.svg' />
                  </div>
                }
                <p className='input-label text-center mt-3'>
                  {title ? title : <>Drag your document here, or click to browse.</>}
                </p>
                <p className='settings-subtext text-center mt-3'>
                  {subtitle}
                </p>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default FileUploader;
