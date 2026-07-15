package com.Farm.NASMS.service;

import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.repository.FarmingSeasonRepository;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FarmingSeasonServiceImpl implements FarmingSeasonService{
    private FarmingSeasonRepository farmingSeasonRepository;
    public FarmingSeasonServiceImpl(FarmingSeasonRepository farmingSeasonRepository){
        this.farmingSeasonRepository = farmingSeasonRepository;
    }
    @Override
    public FarmingSeason createSeason(FarmingSeason season) {
        return farmingSeasonRepository.save(season);
    }

    @Override
    public List<FarmingSeason> getAllSeasons() {
        return farmingSeasonRepository.findAll();
    }

    @Override
    public FarmingSeason getSeasonById(Long id) {
        return farmingSeasonRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Season not found!"));
    }

    @Override
    public FarmingSeason updateSeason(Long id, FarmingSeason season) {
        FarmingSeason existing = getSeasonById(id);
        existing.setSeasonName(season.getSeasonName());
        existing.setStartDate(season.getStartDate());
        existing.setEndDate(season.getEndDate());
        return farmingSeasonRepository.save(existing);
    }

    @Override
    public void deleteSeason(Long id) {
        if (!farmingSeasonRepository.existsById(id)) {
            throw new RuntimeException("Season not found");
        }
        farmingSeasonRepository.deleteById(id);

    }
}
