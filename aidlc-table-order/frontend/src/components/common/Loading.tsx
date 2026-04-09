import { Spin } from 'antd';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = '로딩 중...' }: LoadingProps) {
  return (
    <div
      data-testid="loading-spinner"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 200,
        gap: 16,
      }}
    >
      <Spin size="large" />
      <span style={{ color: '#888' }}>{message}</span>
    </div>
  );
}
