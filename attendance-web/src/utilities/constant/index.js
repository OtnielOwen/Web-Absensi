/* eslint-disable no-template-curly-in-string */
export const FORM = {
  VALIDATE_MESSAGE: {
    required: '${label} wajib diisi!',
    string: {
      min: '${label} minimal ${min} karakter!',
      max: '${label} maksimal ${max} karakter!',
    },
    types: {
      email: '${label} email tidak valid',
      number: '${label} hanya berupa angka',
    },
    number: {
      min: '${label} minimal ${min} karakter!',
      max: '${label} maksimal ${max} karakter!',
      range: '${label} hanya ${min} sampai ${max} karakter',
    },
  },
};

export const ROLE_KEYS = {
  admin: true,
  user: false,
};

export const DEFAULT_WEBCAM_RESOLUTION = {
  label: '640x480',
  width: 640,
  height: 480,
};

export const THRESHOLDS = {
  EAR: 0.125,
  MAR: 0.15,
  SMILE: 3.5,
};

export const INSTRUCTIONS = [
  { text: 'Buka Mulut Anda', type: 'mouth', duration: 2 },
  { text: 'Kedipkan Mata Anda', type: 'blink', count: 4 },
  { text: 'Tersenyumlah', type: 'smile', duration: 3 },
];

export const FACE_MESH_CONFIG = {
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
};

export const webcamResolutionType = [
  {
    label: '300x250',
    width: 300,
    height: 250,
  },
  {
    label: '500x350',
    width: 500,
    height: 350,
  },
  {
    label: '640x480',
    width: 640,
    height: 480,
  },
  {
    label: '960x720',
    width: 960,
    height: 720,
  },
  {
    label: '1024x768',
    width: 1024,
    height: 768,
  },
  {
    label: '1280x960',
    width: 1280,
    height: 960,
  },
];

export const DEFAULT_UPLOAD_OPTION = 'Upload File';
export const UPLOAD_OPTION = ['Upload File', 'On Camera'];

const CONSTANT = {
  DATE_FORMAT: 'DD MMM YYYY',
  IMAGE_FALLBACK: 'https://fakeimg.pl/600x300?text=+',
  USER_ATTRIBUTES: 'user_attributes',
  ACCESS_TOKEN: 'access_token',
  ROLE_USER: 'role_user',
};

export default CONSTANT;
