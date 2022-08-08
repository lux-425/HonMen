import React, { useState, useRef } from 'react';

import { Form, Button, Image, Divider, Message, Icon } from 'semantic-ui-react';

import uploadPic from '../../utils/uploadPicToCloudinary';
import { submitNewPost } from '../../utils/postActions';

import CropImageModal from './CropImageModal';

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: '', location: '' });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'media') {
      if (files && files.length > 0) {
        setMedia(files[0]);
        return setMediaPreview(URL.createObjectURL(files[0]));
      }
    }

    setNewPost((prev) => ({ ...prev, [name]: value })); // 大切
  };

  const addStyles = () => ({
    textAlign: 'center',
    height: '150px',
    width: '150px',
    border: 'dotted',
    paddingTop: media === null && '60px',
    cursor: 'pointer',
    borderColor: highlighted ? 'green' : 'black',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError('Error uploading image.');
      }
    }

    await submitNewPost(
      // 大切
      user,
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    mediaPreview && URL.revokeObjectURL(mediaPreview); // 大事
    setTimeout(() => setMediaPreview(null), 3000);

    setLoading(false);
  };

  const dragEvent = (e, valueToSet) => {
    e.preventDefault();

    setHighlighted(valueToSet);
  };

  return (
    <>
      {showModal && (
        <CropImageModal
          mediaPreview={mediaPreview}
          setMedia={setMedia}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header='Error creating post.'
        />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder="What's on your mind?"
            name='text'
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            value={newPost.location}
            name='location'
            onChange={handleChange}
            label='Add the location'
            icon='map marker alternate'
            placeholder='Share your location'
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name='media'
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
          />
        </Form.Group>

        <div
          onClick={() => inputRef.current.click()} // 大切
          style={addStyles()}
          onDragOver={(e) => dragEvent(e, true)}
          onDragLeave={(e) => dragEvent(e, false)}
          onDrop={(e) => {
            dragEvent(e, true);

            const droppedFile = Array.from(e.dataTransfer.files); // 大事

            if (droppedFile?.length > 0) {
              setMedia(droppedFile[0]);
              setMediaPreview(URL.createObjectURL(droppedFile[0]));
            }
          }}
        >
          {media === null ? (
            <Icon name='plus' size='big' />
          ) : (
            <Image
              style={{ height: '150px', width: '150px' }}
              src={mediaPreview}
              alt='PostImage'
              centered
              size='medium'
            />
          )}
        </div>

        {mediaPreview !== null && (
          <>
            <Divider hidden />

            <Button
              content='Crop image'
              type='button'
              primary
              circular
              onClick={() => setShowModal(true)}
            />
          </>
        )}

        <Divider hidden />

        <Button
          circular
          disabled={newPost.text === '' || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: '#1a8cd8', color: 'white' }}
          icon='send'
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}

export default CreatePost;
