package com.pdk.odoo.service;

import com.pdk.odoo.dto.*;
import com.pdk.odoo.model.*;
import com.pdk.odoo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyConfigService {

    private final CompanyConfigRepository companyConfigRepository;

    @Transactional
    public CompanyConfigDto saveConfig(Long companyId, CompanyConfigDto dto) {
        CompanyConfig config = companyConfigRepository.findByCompanyId(companyId)
                .orElse(CompanyConfig.builder().companyId(companyId).build());

        if (dto.getBaseCurrency() != null) {
            config.setBaseCurrency(dto.getBaseCurrency());
        }
        
        if (dto.getApprovalRule() != null) {
            config.setApprovalRuleType(dto.getApprovalRule().getType());
            config.setRuleMinPercentage(dto.getApprovalRule().getMinPercentage());
            config.setRuleSpecificApproverId(dto.getApprovalRule().getSpecificApproverId());
            config.setRuleSpecificApproverName(dto.getApprovalRule().getSpecificApproverName());
        }

        if (config.getApprovalSequence() == null) {
            config.setApprovalSequence(new ArrayList<>());
        } else {
            config.getApprovalSequence().clear();
        }

        if (dto.getApprovalSequence() != null) {
            for (ApprovalSequenceStepDto stepDto : dto.getApprovalSequence()) {
                config.getApprovalSequence().add(ApprovalSequenceStepTemplate.builder()
                        .companyConfig(config)
                        .stepNumber(stepDto.getStepNumber())
                        .role(stepDto.getRole())
                        .approverId(stepDto.getApproverId())
                        .approverName(stepDto.getApproverName())
                        .build());
            }
        }

        CompanyConfig saved = companyConfigRepository.save(config);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public CompanyConfigDto getConfig(Long companyId) {
        CompanyConfig config = companyConfigRepository.findByCompanyId(companyId)
                .orElse(null);
        if (config == null) return new CompanyConfigDto();
        return mapToDto(config);
    }

    public static CompanyConfigDto mapToDto(CompanyConfig config) {
        return CompanyConfigDto.builder()
                .baseCurrency(config.getBaseCurrency() == null ? "USD" : config.getBaseCurrency())
                .approvalRule(ApprovalRuleDto.builder()
                        .type(config.getApprovalRuleType() == null ? "percentage" : config.getApprovalRuleType())
                        .minPercentage(config.getRuleMinPercentage() == null ? 67 : config.getRuleMinPercentage())
                        .specificApproverId(config.getRuleSpecificApproverId())
                        .specificApproverName(config.getRuleSpecificApproverName())
                        .build())
                .approvalSequence(config.getApprovalSequence() == null ? new ArrayList<>() :
                        config.getApprovalSequence().stream()
                                .map(s -> ApprovalSequenceStepDto.builder()
                                        .stepNumber(s.getStepNumber())
                                        .role(s.getRole())
                                        .approverId(s.getApproverId())
                                        .approverName(s.getApproverName())
                                        .build())
                                .collect(Collectors.toList()))
                .build();
    }
}
