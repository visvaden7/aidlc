import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, notification } from 'antd';
import { ShoppingCartOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { menuApi } from '@/services/menuApi';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import CategoryTabs from '@/components/customer/CategoryTabs';
import MenuCard from '@/components/customer/MenuCard';
import MenuDetailModal from '@/components/customer/MenuDetailModal';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { Category, Menu } from '@/types';

export default function MenuPage() {
  const navigate = useNavigate();
  const { storeId, storeName, tableNumber } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allMenus, setAllMenus] = useState<Menu[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const loadData = async () => {
    if (!storeId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, menuRes] = await Promise.all([
        menuApi.getCategories(storeId),
        menuApi.getMenus(storeId),
      ]);
      setCategories(catRes.data);
      setAllMenus(menuRes.data);
    } catch {
      setError('메뉴 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const filteredMenus = selectedCategoryId
    ? allMenus.filter((m) => m.categoryId === selectedCategoryId)
    : allMenus;

  const handleAddToCart = (menu: Menu, quantity: number) => {
    let allAdded = true;
    for (let i = 0; i < quantity; i++) {
      if (!addItem(menu)) {
        allAdded = false;
        break;
      }
    }
    if (allAdded) {
      notification.success({
        message: '장바구니 추가',
        description: `${menu.menuName} ${quantity}개를 장바구니에 추가했습니다.`,
        duration: 2,
      });
    } else {
      notification.warning({
        message: '수량 초과',
        description: '최대 수량(10개)에 도달했습니다.',
        duration: 3,
      });
    }
  };

  const itemCount = getItemCount();

  return (
    <div
      data-testid="menu-page"
      style={{ minHeight: '100vh', background: '#fff' }}
    >
      {/* 상단 네비게이션 아이콘 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '12px 24px',
          gap: 20,
        }}
      >
        <span style={{ fontSize: 12, color: '#999' }}>
          테이블 {tableNumber}번
        </span>
        <UnorderedListOutlined
          onClick={() => navigate('/orders')}
          style={{ fontSize: 20, color: '#555', cursor: 'pointer' }}
          data-testid="customer-header-orders-button"
        />
        <Badge count={itemCount} size="small" offset={[-2, 2]}>
          <ShoppingCartOutlined
            onClick={() => navigate('/cart')}
            style={{ fontSize: 20, color: '#555', cursor: 'pointer' }}
            data-testid="customer-header-cart-button"
          />
        </Badge>
      </div>

      {/* 매장 이름 */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 24px 8px',
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#2c2c2c',
            margin: 0,
            letterSpacing: 2,
          }}
        >
          {storeName || '테이블오더'}
        </h1>
      </div>

      {isLoading ? (
        <Loading message="메뉴를 불러오는 중..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : (
        <>
          {/* 카테고리 탭 */}
          <CategoryTabs
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            showAll={true}
          />

          {/* 메뉴 그리드 (2열) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              padding: '8px 32px 40px',
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            {filteredMenus.map((menu) => (
              <MenuCard key={menu.menuId} menu={menu} onClick={setSelectedMenu} />
            ))}
          </div>
        </>
      )}

      <MenuDetailModal
        menu={selectedMenu}
        open={selectedMenu !== null}
        onClose={() => setSelectedMenu(null)}
        onAdd={handleAddToCart}
      />
    </div>
  );
}
