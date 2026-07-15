package com.Farm.NASMS.service;

import com.Farm.NASMS.dto.ApplyRequest;
import com.Farm.NASMS.dto.ApplicationResponse;
import com.Farm.NASMS.enums.LoanStatus;
import com.Farm.NASMS.model.Farmer;
import com.Farm.NASMS.model.FarmingSeason;
import com.Farm.NASMS.model.Loan;
import com.Farm.NASMS.model.LoanPackage;
import com.Farm.NASMS.repository.FarmerRepository;
import com.Farm.NASMS.repository.FarmingSeasonRepository;
import com.Farm.NASMS.repository.LoanPackageRepository;
import com.Farm.NASMS.repository.LoanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final FarmerRepository       farmerRepository;
    private final LoanRepository         loanRepository;
    private final LoanPackageRepository  loanPackageRepository;
    private final FarmingSeasonRepository farmingSeasonRepository;

    private static final DateTimeFormatter DISPLAY_DATE =
            DateTimeFormatter.ofPattern("MMM dd, yyyy");

    public LoanServiceImpl(FarmerRepository farmerRepository,
                           LoanRepository loanRepository,
                           LoanPackageRepository loanPackageRepository,
                           FarmingSeasonRepository farmingSeasonRepository) {
        this.farmerRepository        = farmerRepository;
        this.loanRepository          = loanRepository;
        this.loanPackageRepository   = loanPackageRepository;
        this.farmingSeasonRepository = farmingSeasonRepository;
    }

    @Override
    public Loan createLoanFromPackage(Long nationalId, String loanCode, Long seasonId) {
        Farmer farmer = farmerRepository.findByNationalId(nationalId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        FarmingSeason season = farmingSeasonRepository.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found"));
        LoanPackage pkg = loanPackageRepository.findById(loanCode)
                .orElseThrow(() -> new RuntimeException("Loan package not found"));

        if (season.shouldAutoClose()) {
            season.setClosed(true);
            farmingSeasonRepository.save(season);
        }
        if (!season.isActive()) {
            throw new RuntimeException("Loans can only be applied during an active season");
        }

        Double seasonTotal = loanRepository.getTotalLoanAmountBySeason(season.getId());
        double used = (seasonTotal == null) ? 0 : seasonTotal;
        if (used + pkg.getAmount() > season.getBudget()) {
            throw new RuntimeException("Season budget exceeded");
        }

        if (loanRepository.existsByFarmerAndFarmingSeason(farmer, season)) {
            throw new RuntimeException("Farmer already has a loan in this season");
        }

        Loan loan = new Loan();
        loan.setFarmer(farmer);
        loan.setFarmingSeason(season);
        loan.setLoanPackage(pkg);
        loan.setAmount(pkg.getAmount());
        loan.setInterestRate(pkg.getInterestRate());
        loan.setMonthlyPenalty(pkg.getMonthlyPenalty());
        loan.setDurationMonths(pkg.getDurationMonths());

        LocalDateTime now = LocalDateTime.now();
        loan.setIssuedDate(now);
        loan.setDueDate(now.plusMonths(pkg.getDurationMonths()));

        double time     = pkg.getDurationMonths() / 12.0;
        double interest = pkg.getAmount() * (pkg.getInterestRate() / 100.0) * time;
        loan.setTotalPayment(pkg.getAmount() + interest);
        loan.setStatus(LoanStatus.PENDING);

        return loanRepository.save(loan);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public Loan getLoansById(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan #" + id + " not found"));
    }

    @Override
    public List<Loan> getLoansByFarmer(Long nationalId, String status) {
        return loanRepository.findByFarmerNationalIdAndStatus(nationalId, status);
    }

    /** Admin: update loan status by loan ID (not loanCode). */
    @Override
    public Loan updateLoanStatus(Long id, String status) {
        Loan loan = getLoansById(id);
        loan.setStatus(LoanStatus.valueOf(status.trim().toUpperCase()));
        return loanRepository.save(loan);
    }

    @Override
    public Loan payLoan(Long id) {
        Loan loan = getLoansById(id);
        LocalDateTime now = LocalDateTime.now();
        loan.setDueDate(now);
        loan.setTotalPayment(loan.calculateTotalDue(now));
        loan.setStatus(LoanStatus.COMPLETED);
        return loanRepository.save(loan);
    }

    @Override
    public void deleteLoan(Long id) {
        loanRepository.delete(getLoansById(id));
    }

    /** GET /api/loans/applications/me — returns the logged-in farmer's loans. */
    @Override
    public List<ApplicationResponse> getApplicationsByUsername(String email) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for: " + email));

        return loanRepository
                .findByFarmerNationalIdAndStatus(farmer.getNationalId(), null)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** POST /api/loans/apply — farmer applies from the frontend. */
    @Override
    public ApplicationResponse applyFromFrontend(String email, ApplyRequest req) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for: " + email));

        LoanPackage pkg = loanPackageRepository.findById(req.loanProductId())
                .orElseThrow(() -> new RuntimeException("Loan package not found: " + req.loanProductId()));

        if (pkg.getFarmingSeason() == null) {
            throw new RuntimeException("This loan package has no associated season.");
        }

        Loan created = createLoanFromPackage(
                farmer.getNationalId(),
                pkg.getLoanCode(),
                pkg.getFarmingSeason().getId()
        );
        return toDto(created);
    }

    private ApplicationResponse toDto(Loan loan) {
        String loanName = (loan.getLoanPackage() != null)
                ? loan.getLoanPackage().getLoanCode() : "—";
        String applied  = (loan.getCreatedAt()  != null)
                ? loan.getCreatedAt().format(DISPLAY_DATE)  : "—";
        String due      = (loan.getDueDate()     != null)
                ? loan.getDueDate().format(DISPLAY_DATE)    : "—";

        return new ApplicationResponse(
                loan.getId(),
                loanName,
                (long) loan.getAmount(),
                applied,
                loan.getStatus().name(),
                due
        );
    }
}
