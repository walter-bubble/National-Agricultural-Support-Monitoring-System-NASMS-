package com.Farm.NASMS.Service;

import com.Farm.NASMS.FarmingSeason;

import java.util.List;

public interface FarmingSeasonService {
    FarmingSeason createSeason(FarmingSeason season);
    List<FarmingSeason> getAllSeasons();
    FarmingSeason getSeasonById(Long id);
    FarmingSeason updateSeason(Long id, FarmingSeason season);
    void deleteSeason(Long id);
}
