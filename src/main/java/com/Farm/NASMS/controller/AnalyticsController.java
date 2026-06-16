package com.Farm.NASMS.controller;

import com.Farm.NASMS.dto.SeasonAnalyticsDto;
import com.Farm.NASMS.dto.SeasonComparisonDto;
import com.Farm.NASMS.dto.SeasonGraphDto;
import com.Farm.NASMS.service.AnalyticsService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/analytics")
public class AnalyticsController {
    private AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService){
        this.analyticsService=analyticsService;
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/season/{seasonId}")
    public ResponseEntity<SeasonAnalyticsDto> getSeasonAnalytics(@PathVariable Long seasonId){
        return ResponseEntity.ok(analyticsService.getSeasonAnalytics(seasonId));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/compare")
    public ResponseEntity<SeasonComparisonDto> compareSeasons(@RequestParam Long season1,
                                                             @RequestParam Long season2){
        return ResponseEntity.ok(analyticsService.compareSeasons(season1,season2));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/graph")
    public ResponseEntity<List<SeasonGraphDto>> getGraphData(){
        return ResponseEntity.ok(analyticsService.getAllSeasonAnalytics());
    }

}

