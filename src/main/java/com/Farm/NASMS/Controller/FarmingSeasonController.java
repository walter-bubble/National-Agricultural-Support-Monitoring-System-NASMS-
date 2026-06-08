package com.Farm.NASMS.Controller;

import com.Farm.NASMS.FarmingSeason;
import com.Farm.NASMS.Service.FarmingSeasonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/seasons")
public class FarmingSeasonController {
    private FarmingSeasonService farmingSeasonService;
    public FarmingSeasonController(FarmingSeasonService farmingSeasonService){
        this.farmingSeasonService=farmingSeasonService;
    }
    @PostMapping
    public FarmingSeason createSeason(@RequestBody FarmingSeason season){
        return farmingSeasonService.createSeason(season);
    }
    @GetMapping
    public List<FarmingSeason> getAllSeasons(){
        return farmingSeasonService.getAllSeasons();
    }
    @GetMapping("/{id}")
    public FarmingSeason getSeason(@PathVariable Long id){
        return farmingSeasonService.getSeasonById(id);
    }
    @PutMapping("/{id}")
    public FarmingSeason updateFarmingSeason(@PathVariable Long id,@RequestBody FarmingSeason season){
        return farmingSeasonService.updateSeason(id,season);
    }
    @DeleteMapping("/{id}")
    public void deleteSeason(@PathVariable Long id){
        farmingSeasonService.deleteSeason(id);
    }
}
