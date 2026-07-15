package com.Farm.NASMS.controller;

import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.service.FarmingSeasonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seasons")
public class FarmingSeasonController {

    private final FarmingSeasonService service;

    public FarmingSeasonController(FarmingSeasonService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<FarmingSeason> create(@RequestBody FarmingSeason season) {
        return ResponseEntity.ok(service.createSeason(season));
    }

    @GetMapping
    public List<FarmingSeason> getAll() {
        return service.getAllSeasons();
    }

    @GetMapping("/{id}")
    public FarmingSeason getById(@PathVariable Long id) {
        return service.getSeasonById(id);
    }

    @PutMapping("/{id}")
    public FarmingSeason update(@PathVariable Long id, @RequestBody FarmingSeason season) {
        return service.updateSeason(id, season);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteSeason(id);
        return ResponseEntity.noContent().build();
    }
}
