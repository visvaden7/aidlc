import type { Menu } from '@/types';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="#f0f0f0"><rect width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb" font-size="16">No Image</text></svg>',
  );

interface MenuCardProps {
  menu: Menu;
  onClick: (menu: Menu) => void;
}

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  return (
    <div
      data-testid={`menu-card-${menu.menuId}`}
      onClick={() => onClick(menu)}
      style={{
        cursor: 'pointer',
        opacity: menu.isAvailable ? 1 : 0.5,
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
        <img
          alt={menu.menuName}
          src={menu.imageUrl || PLACEHOLDER_IMAGE}
          style={{
            width: '100%',
            height: 220,
            objectFit: 'cover',
            display: 'block',
            borderRadius: 8,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
        {!menu.isAvailable && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              fontWeight: 700,
              borderRadius: 8,
            }}
          >
            품절
          </div>
        )}
      </div>
      <div style={{ padding: '12px 4px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#2c2c2c', marginBottom: 4 }}>
          {menu.menuName}
        </div>
        {menu.description && (
          <div
            style={{
              fontSize: 13,
              color: '#888',
              marginBottom: 6,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {menu.description}
          </div>
        )}
        <div style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>
          {formatPrice(menu.price)}
        </div>
      </div>
    </div>
  );
}
