import { Button, Result } from 'antd';

function Error404() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Maaf, halaman yang Anda cari tidak ditemukan."
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          Kembali ke Beranda
        </Button>
      }
    />
  );
}

export default Error404;
