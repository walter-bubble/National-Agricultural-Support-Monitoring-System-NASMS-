package com.Farm.NASMS.service;

import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.repository.FarmingSeasonRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class SeasonSchedulerService {
    private FarmingSeasonRepository farmingSeasonRepository;
    private NotificationService notificationService;
    public SeasonSchedulerService(FarmingSeasonRepository farmingSeasonRepository,
                                  NotificationService notificationService){
        this.farmingSeasonRepository = farmingSeasonRepository;
    }
    @Scheduled(cron = "0 0 0 * * *")//every midnight
    public void autoCloseSeason(){
        List<FarmingSeason> seasons = farmingSeasonRepository.findAll();

        for(FarmingSeason season:seasons){
            if(!season.isClosed() && season.shouldAutoClose()){
                season.setClosed(true);
                farmingSeasonRepository.save(season);
            }
        }
    }
    @Scheduled(cron="0 0 8 * * *")
    public void seasonEndWarnings(){
        List<FarmingSeason> seasons = farmingSeasonRepository.findAll();

        for(FarmingSeason season:seasons){
            if(!season.isClosed()){
                Long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(),season.getEndDate());
                if(daysLeft <=10 && daysLeft >0){
                    notificationService.sendAlert("season " + season.getSeasonName() + " ends in " + daysLeft + " days");
                }
            }

        }
    }
}
