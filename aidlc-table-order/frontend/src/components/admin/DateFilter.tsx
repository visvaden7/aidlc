import { DatePicker, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DateFilterProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (startDate: string | null, endDate: string | null) => void;
}

export default function DateFilter({
  startDate,
  endDate,
  onChange,
}: DateFilterProps) {
  const value: [dayjs.Dayjs | null, dayjs.Dayjs | null] = [
    startDate ? dayjs(startDate) : null,
    endDate ? dayjs(endDate) : null,
  ];

  return (
    <Space data-testid="date-filter">
      <RangePicker
        value={value}
        onChange={(dates) => {
          if (dates && dates[0] && dates[1]) {
            onChange(
              dates[0].format('YYYY-MM-DD'),
              dates[1].format('YYYY-MM-DD'),
            );
          } else {
            onChange(null, null);
          }
        }}
        data-testid="date-filter-range-picker"
      />
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={() => onChange(startDate, endDate)}
        data-testid="date-filter-search-button"
      >
        검색
      </Button>
    </Space>
  );
}
