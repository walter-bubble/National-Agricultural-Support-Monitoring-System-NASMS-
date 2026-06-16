package com.Farm.NASMS.service;

import java.util.List;

import com.Farm.NASMS.model.FarmingSeason;

public interface FarmingSeasonService {
    FarmingSeason createSeason(FarmingSeason season);
    List<FarmingSeason> getAllSeasons();
    FarmingSeason getSeasonById(Long id);
    FarmingSeason updateSeason(Long id, FarmingSeason season);
    void deleteSeason(Long id);
}
