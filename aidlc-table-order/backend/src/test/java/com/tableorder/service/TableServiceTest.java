package com.tableorder.service;

import com.tableorder.entity.TableInfo;
import com.tableorder.entity.TableSession;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock private TableInfoRepository tableInfoRepository;
    @Mock private TableSessionRepository tableSessionRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private SseService sseService;

    @InjectMocks private TableService tableService;

    @Test
    void completeTableSession_success() {
        TableSession session = TableSession.builder()
                .sessionId(1L).tableId(1L).storeId(1L).isActive(true).build();

        when(tableSessionRepository.findByTableIdAndIsActive(1L, true))
                .thenReturn(Optional.of(session));
        when(tableSessionRepository.save(any())).thenReturn(session);

        tableService.completeTableSession(1L, 1L);

        assertThat(session.getIsActive()).isFalse();
        assertThat(session.getEndedAt()).isNotNull();
        verify(sseService).publishEvent(eq(1L), eq("table-session-completed"), any());
    }

    @Test
    void completeTableSession_noActiveSession_throwsException() {
        when(tableSessionRepository.findByTableIdAndIsActive(1L, true))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.completeTableSession(1L, 1L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("활성 세션이 없습니다");
    }

    @Test
    void getAllTablesWithSummary_returnsAllTables() {
        TableInfo t1 = TableInfo.builder().tableId(1L).storeId(1L).tableNumber(1).build();
        TableInfo t2 = TableInfo.builder().tableId(2L).storeId(1L).tableNumber(2).build();

        when(tableInfoRepository.findByStoreIdOrderByTableNumber(1L)).thenReturn(List.of(t1, t2));
        when(tableSessionRepository.findByTableIdAndIsActive(anyLong(), eq(true)))
                .thenReturn(Optional.empty());

        var result = tableService.getAllTablesWithSummary(1L);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTableNumber()).isEqualTo(1);
        assertThat(result.get(0).getActiveSession()).isFalse();
        assertThat(result.get(0).getTotalAmount()).isZero();
    }
}
