import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (categoryId: number | null) => void;
  showAll?: boolean;
}

export default function CategoryTabs({
  categories,
  selectedId,
  onSelect,
  showAll = false,
}: CategoryTabsProps) {
  return (
    <div
      data-testid="category-tabs"
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 24px',
        flexWrap: 'wrap',
      }}
    >
      {showAll && (
        <button
          onClick={() => onSelect(null)}
          data-testid="category-tab-all"
          style={{
            padding: '8px 20px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            background: selectedId === null ? '#2c2c2c' : '#f0f0f0',
            color: selectedId === null ? '#fff' : '#666',
            transition: 'all 0.2s',
          }}
        >
          ALL
        </button>
      )}
      {categories.map((c) => (
        <button
          key={c.categoryId}
          onClick={() => onSelect(c.categoryId)}
          data-testid={`category-tab-${c.categoryId}`}
          style={{
            padding: '8px 20px',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            background: selectedId === c.categoryId ? '#2c2c2c' : '#f0f0f0',
            color: selectedId === c.categoryId ? '#fff' : '#666',
            transition: 'all 0.2s',
          }}
        >
          {c.categoryName}
        </button>
      ))}
    </div>
  );
}
