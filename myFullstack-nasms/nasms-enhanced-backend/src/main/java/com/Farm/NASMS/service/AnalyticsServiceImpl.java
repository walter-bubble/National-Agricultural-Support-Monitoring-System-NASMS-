package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.SeasonAnalyticsDto;
import com.Farm.NASMS.dto.SeasonComparisonDto;
import com.Farm.NASMS.dto.SeasonGraphDto;
import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.repository.FarmerRepository;
import com.Farm.NASMS.repository.FarmingSeasonRepository;
import com.Farm.NASMS.repository.LoanRepository;
import com.Farm.NASMS.repository.MarketTransactionRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class AnalyticsServiceImpl implements AnalyticsService{
    private FarmerRepository farmerRepository;
    private LoanRepository loanRepository;
    private MarketTransactionRepository marketTransactionRepository;
    private FarmingSeasonRepository farmingSeasonRepository;
    public AnalyticsServiceImpl(FarmingSeasonRepository farmingSeasonRepository,
                                MarketTransactionRepository marketTransactionRepository,
                                LoanRepository loanRepository,
                                FarmerRepository farmerRepository){
        this.farmerRepository=farmerRepository;
        this.loanRepository=loanRepository;
        this.marketTransactionRepository=marketTransactionRepository;
        this.farmingSeasonRepository=farmingSeasonRepository;
    }
    @Override
    public SeasonAnalyticsDto getSeasonAnalytics(Long seasonId) {
        FarmingSeason farmingSeason = farmingSeasonRepository.findById(seasonId).
                orElseThrow(()->new RuntimeException("Season not Found"));
        SeasonAnalyticsDto seasonAnalyticsDto = new SeasonAnalyticsDto();
        seasonAnalyticsDto.setSeasonName(farmingSeason.getSeasonName());

        seasonAnalyticsDto.setTotalFarmers(farmerRepository.count());

        seasonAnalyticsDto.setApprovedLoans(loanRepository.countApprovedLoans(seasonId));

        seasonAnalyticsDto.setRejectedLoans(loanRepository.countLoansBySeason(seasonId)
                -loanRepository.countApprovedLoans(seasonId));

        double loanAmount = toDouble(loanRepository.getTotalLoanAmountBySeason(seasonId));
        seasonAnalyticsDto.setTotalLoans(loanRepository.countLoansBySeason(seasonId));
        seasonAnalyticsDto.setTotalSupportFunds(farmingSeason.getBudget());
        seasonAnalyticsDto.setTotalSales(marketTransactionRepository.getTotalSalesBySeason(seasonId));
        seasonAnalyticsDto.setRemainingBudget(farmingSeason.getBudget()-loanAmount);
        seasonAnalyticsDto.setLoanUtilizationRate(farmingSeason.getBudget() == 0 ? 0
                :(loanAmount/farmingSeason.getBudget())*100);
        return seasonAnalyticsDto;
    }

    @Override
    public SeasonComparisonDto compareSeasons(Long season1, Long season2) {
        SeasonAnalyticsDto s1 = getSeasonAnalytics(season1);
        SeasonAnalyticsDto s2 = getSeasonAnalytics(season2);

        SeasonComparisonDto seasonComparisonDto = new SeasonComparisonDto();
        seasonComparisonDto.setSeason1(s1.getSeasonName());
        seasonComparisonDto.setSeason2(s2.getSeasonName());

        //sales
        seasonComparisonDto.setSeason1Sales(s1.getTotalSales());
        seasonComparisonDto.setSeason2Sales(s2.getTotalSales());
        seasonComparisonDto.setSalesGrowthPercentage(calcGrowth(s1.getTotalSales(), s2.getTotalSales()));

        //farmers
        seasonComparisonDto.setSeason1Farmers(s1.getTotalFarmers());
        seasonComparisonDto.setSeason2Farmers(s2.getTotalFarmers());
        seasonComparisonDto.setFarmersGrowthPercentage(calcGrowth(toDouble(s1.getTotalFarmers()), toDouble(s2.getTotalFarmers())));

        //loans
        seasonComparisonDto.setSeason1Loans(s1.getTotalLoans());
        seasonComparisonDto.setSeason2Loans(s2.getTotalLoans());
        seasonComparisonDto.setLoansGrowthPercentage(calcGrowth(toDouble(s1.getTotalLoans()),toDouble(s2.getTotalLoans())));
        return seasonComparisonDto;
    }

    private double toDouble(Number value) {
        return value ==null?0.0:value.doubleValue();
    }


    @Override
    public List<SeasonGraphDto> getAllSeasonAnalytics() {
        List<FarmingSeason> seasons = farmingSeasonRepository.findAll();
        List<SeasonGraphDto> list = new ArrayList<>();
        for(FarmingSeason season:seasons){
            double loans = toDouble(loanRepository.getTotalLoanAmountBySeason(season.getId()));
            double sales = toDouble(marketTransactionRepository.getTotalSalesBySeason(season.getId()));

            SeasonGraphDto loanDto = new SeasonGraphDto();
            loanDto.setSeasonName(season.getSeasonName());
            loanDto.setMetricType("LOANS");
            loanDto.setValue(loans);
            list.add(loanDto);

            SeasonGraphDto salesDto = new SeasonGraphDto();
            salesDto.setSeasonName(season.getSeasonName());
            salesDto.setMetricType("SALES");
            salesDto.setValue(sales);
            list.add(salesDto);
        }
        return list;
    }
    private double calcGrowth(double oldVal, double newVal){
        if (oldVal==0)
            return 100.0;
        return ((newVal-oldVal)/oldVal)*100;
    }
}
