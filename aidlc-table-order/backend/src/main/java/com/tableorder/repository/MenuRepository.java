package com.tableorder.repository;

import com.tableorder.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByStoreIdOrderByDisplayOrder(Long storeId);
    List<Menu> findByStoreIdAndCategoryIdOrderByDisplayOrder(Long storeId, Long categoryId);
    int countByCategoryId(Long categoryId);
}
