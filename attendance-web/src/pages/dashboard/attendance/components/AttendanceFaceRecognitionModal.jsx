import { useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';
import axios from 'axios';
import { getAuthHeader, getUser } from '@/utilities/authorization';
import { createMatcher } from '@/utilities/faceHelper';
import ProcessFaceRecognition from './ProcessFaceRecognition';

const { Text } = Typography;

function AttendanceFaceRecognition({ user, values, location, onSuccessAttendance }) {
  const [participants, setParticipants] = useState(null);
  const [faceMatcher, setFaceMatcher] = useState(null);

  const matcher = async () => {
    axios
      .get('http://localhost:5000/api/v1/photos/match', {
        headers: {
          ...getAuthHeader(),
        },
      })
      .then((res) => {
        setParticipants(res?.data?.data);
        const profileList = createMatcher(res?.data?.data, 0.55);
        profileList.then((result) => setFaceMatcher(result));
      });
  };

  useEffect(() => {
    matcher();
  }, []);

  return (
    <>
      {!location ? (
        <Text>Lokasi anda tidak ditemukan harap nyalakan lokasi</Text>
      ) : (
        <ProcessFaceRecognition
          faceMatcher={faceMatcher}
          participants={participants}
          values={values}
          onSuccessAttendance={onSuccessAttendance}
          location={location}
        />
      )}
    </>
  );
}

function AttendanceFaceRecognitionModal({
  isOpen,
  setIsOpen,
  onCloseFormModal,
  values,
  location,
  onSuccessAttendance,
}) {
  const user = getUser();
  const [modal, contextHolder] = Modal.useModal();

  return (
    <>
      {contextHolder}
      <Modal
        title="Absensi Wajah"
        open={isOpen}
        onOk={() => setIsOpen(false)}
        onCancel={() => {
          modal.confirm({
            title: 'Perhatian',
            content: 'Apakah anda yakin untuk membatalkan proses ini?',
            onOk() {
              setIsOpen(false);
              onCloseFormModal();
            },
          });
        }}
        width={800}
        footer={null}
        centered
        destroyOnClose
      >
        <AttendanceFaceRecognition
          user={user}
          values={values}
          onSuccessAttendance={onSuccessAttendance}
          location={location}
        />
      </Modal>
    </>
  );
}

export default AttendanceFaceRecognitionModal;
