import { Result, Button } from 'antd';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <Result
      data-testid="error-message"
      status="error"
      title="오류가 발생했습니다"
      subTitle={message}
      extra={
        onRetry && (
          <Button
            type="primary"
            onClick={onRetry}
            data-testid="error-retry-button"
          >
            다시 시도
          </Button>
        )
      }
    />
  );
}
