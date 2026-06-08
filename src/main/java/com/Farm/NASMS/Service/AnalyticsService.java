package com.Farm.NASMS.Service;

import com.Farm.NASMS.dto.SeasonAnalyticsDto;
import com.Farm.NASMS.dto.SeasonComparisonDto;
import com.Farm.NASMS.dto.SeasonGraphDto;

import java.util.List;

public interface AnalyticsService {
SeasonAnalyticsDto getSeasonAnalytics(Long seasonId);
SeasonComparisonDto compareSeasons(Long season1,Long season2);
List<SeasonGraphDto> getAllSeasonAnalytics();
}
