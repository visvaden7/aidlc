package com.tableorder.service;

import com.tableorder.dto.request.LoginRequest;
import com.tableorder.dto.request.TableLoginRequest;
import com.tableorder.dto.response.LoginResponse;
import com.tableorder.dto.response.TableLoginResponse;
import com.tableorder.entity.AdminUser;
import com.tableorder.entity.Store;
import com.tableorder.entity.TableInfo;
import com.tableorder.entity.TableSession;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.*;
import com.tableorder.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StoreRepository storeRepository;
    private final AdminUserRepository adminUserRepository;
    private final TableInfoRepository tableInfoRepository;
    private final TableSessionRepository tableSessionRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    @Transactional
    public LoginResponse adminLogin(LoginRequest request) {
        Store store = storeRepository.findByStoreCode(request.getStoreCode())
                .orElseThrow(() -> BusinessException.notFound("매장을 찾을 수 없습니다."));

        AdminUser admin = adminUserRepository.findByStoreIdAndUsername(store.getStoreId(), request.getUsername())
                .orElseThrow(() -> BusinessException.unauthorized("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (admin.isLocked()) {
            throw BusinessException.locked("계정이 잠겼습니다. 잠시 후 다시 시도해 주세요.");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            admin.setLoginAttempts(admin.getLoginAttempts() + 1);
            if (admin.getLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                admin.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
            }
            adminUserRepository.save(admin);
            throw BusinessException.unauthorized("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        admin.setLoginAttempts(0);
        admin.setLockedUntil(null);
        adminUserRepository.save(admin);

        String token = jwtTokenProvider.generateAdminToken(admin.getAdminUserId(), store.getStoreId());
        return LoginResponse.builder()
                .token(token)
                .storeId(store.getStoreId())
                .expiresIn(16 * 60 * 60L)
                .build();
    }

    public TableLoginResponse tableLogin(TableLoginRequest request) {
        Store store = storeRepository.findByStoreCode(request.getStoreCode())
                .orElseThrow(() -> BusinessException.notFound("매장을 찾을 수 없습니다."));

        TableInfo table = tableInfoRepository.findByStoreIdAndTableNumber(store.getStoreId(), request.getTableNumber())
                .orElseThrow(() -> BusinessException.notFound("테이블을 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), table.getTablePassword())) {
            throw BusinessException.unauthorized("테이블 비밀번호가 올바르지 않습니다.");
        }

        Long sessionId = tableSessionRepository.findByTableIdAndIsActive(table.getTableId(), true)
                .map(TableSession::getSessionId)
                .orElse(null);

        String token = jwtTokenProvider.generateTableToken(table.getTableId(), store.getStoreId());
        return TableLoginResponse.builder()
                .token(token)
                .storeId(store.getStoreId())
                .tableId(table.getTableId())
                .sessionId(sessionId)
                .storeName(store.getStoreName())
                .build();
    }
}
