package com.tableorder.service;

import com.tableorder.dto.request.LoginRequest;
import com.tableorder.dto.response.LoginResponse;
import com.tableorder.entity.AdminUser;
import com.tableorder.entity.Store;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.*;
import com.tableorder.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private StoreRepository storeRepository;
    @Mock private AdminUserRepository adminUserRepository;
    @Mock private TableInfoRepository tableInfoRepository;
    @Mock private TableSessionRepository tableSessionRepository;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private AuthService authService;

    private Store store;
    private AdminUser adminUser;

    @BeforeEach
    void setUp() {
        store = Store.builder().storeId(1L).storeCode("STORE001").storeName("Test Store").build();
        adminUser = AdminUser.builder()
                .adminUserId(1L).storeId(1L).username("admin")
                .passwordHash("hashedPassword").loginAttempts(0).build();
    }

    @Test
    void adminLogin_success() {
        LoginRequest request = new LoginRequest();
        request.setStoreCode("STORE001");
        request.setUsername("admin");
        request.setPassword("admin1234");

        when(storeRepository.findByStoreCode("STORE001")).thenReturn(Optional.of(store));
        when(adminUserRepository.findByStoreIdAndUsername(1L, "admin")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("admin1234", "hashedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateAdminToken(1L, 1L)).thenReturn("jwt-token");

        LoginResponse response = authService.adminLogin(request);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getStoreId()).isEqualTo(1L);
        verify(adminUserRepository).save(adminUser);
        assertThat(adminUser.getLoginAttempts()).isZero();
    }

    @Test
    void adminLogin_wrongPassword_incrementAttempts() {
        LoginRequest request = new LoginRequest();
        request.setStoreCode("STORE001");
        request.setUsername("admin");
        request.setPassword("wrong");

        when(storeRepository.findByStoreCode("STORE001")).thenReturn(Optional.of(store));
        when(adminUserRepository.findByStoreIdAndUsername(1L, "admin")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("wrong", "hashedPassword")).thenReturn(false);

        assertThatThrownBy(() -> authService.adminLogin(request))
                .isInstanceOf(BusinessException.class);

        assertThat(adminUser.getLoginAttempts()).isEqualTo(1);
    }

    @Test
    void adminLogin_storeNotFound() {
        LoginRequest request = new LoginRequest();
        request.setStoreCode("INVALID");
        request.setUsername("admin");
        request.setPassword("admin1234");

        when(storeRepository.findByStoreCode("INVALID")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.adminLogin(request))
                .isInstanceOf(BusinessException.class);
    }
}
