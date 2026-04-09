package com.tableorder.repository;

import com.tableorder.entity.TableInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TableInfoRepository extends JpaRepository<TableInfo, Long> {
    Optional<TableInfo> findByStoreIdAndTableNumber(Long storeId, Integer tableNumber);
    List<TableInfo> findByStoreIdOrderByTableNumber(Long storeId);
}
