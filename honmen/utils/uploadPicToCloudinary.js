import axios from 'axios';

const uploadPic = async (media) => {
  try {
    const form = new FormData();
    form.append('file', media);
    form.append('upload_preset', 'honmen');
    form.append('cloud_name', 'ddm3o8skx');

    const res = await axios.post(process.env.CLOUDINARY_URL, form);

    return res.data.secure_url;
  } catch (error) {
    return;
  }
};

export default uploadPic;
