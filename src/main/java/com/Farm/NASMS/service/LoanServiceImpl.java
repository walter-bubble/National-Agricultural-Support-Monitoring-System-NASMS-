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

@Service
public class LoanServiceImpl implements LoanService {

    private final FarmerRepository farmerRepository;
    private final LoanRepository loanRepository;
    private final LoanPackageRepository loanPackageRepository;
    private final FarmingSeasonRepository farmingSeasonRepository;

    private static final DateTimeFormatter DISPLAY_DATE =
            DateTimeFormatter.ofPattern("MMM dd, yyyy");

    public LoanServiceImpl(FarmerRepository farmerRepository,
                           LoanRepository loanRepository,
                           LoanPackageRepository loanPackageRepository,
                           FarmingSeasonRepository farmingSeasonRepository) {
        this.farmerRepository = farmerRepository;
        this.loanRepository = loanRepository;
        this.loanPackageRepository = loanPackageRepository;
        this.farmingSeasonRepository = farmingSeasonRepository;
    }

    // ─── Existing implementations (unchanged) ────────────────────────────────

    @Override
    public Loan createLoanFromPackage(Long nationalId, String loanCode, Long seasonId) {
        Farmer farmer = farmerRepository.findByNationalId(nationalId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        FarmingSeason season = farmingSeasonRepository.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found!"));
        LoanPackage loanPackage = loanPackageRepository.findById(loanCode)
                .orElseThrow(() -> new RuntimeException("Loan package not found"));

        if (season.shouldAutoClose()) {
            season.setClosed(true);
            farmingSeasonRepository.save(season);
        }
        if (!season.isActive()) {
            throw new RuntimeException("Loans can only be applied during active season");
        }

        Double totalLoans = loanRepository.getTotalLoanAmountBySeason(season.getId());
        double total = (totalLoans == null) ? 0 : totalLoans;
        if (total + loanPackage.getAmount() > season.getBudget()) {
            throw new RuntimeException("Season budget exceeded!");
        }

        boolean exists = loanRepository.existsByFarmerAndFarmingSeason(farmer, season);
        if (exists) {
            throw new RuntimeException("Farmer already has a loan in this season");
        }

        Loan loan = new Loan();
        loan.setFarmer(farmer);
        loan.setFarmingSeason(season);
        loan.setLoanPackage(loanPackage);
        loan.setAmount(loanPackage.getAmount());
        loan.setInterestRate(loanPackage.getInterestRate());
        loan.setMonthlyPenalty(loanPackage.getMonthlyPenalty());
        loan.setDurationMonths(loanPackage.getDurationMonths());

        LocalDateTime now = LocalDateTime.now();
        loan.setIssuedDate(now);
        loan.setDueDate(now.plusMonths(loanPackage.getDurationMonths()));

        double time = loanPackage.getDurationMonths() / 12.0;
        double interest = loanPackage.getAmount() * (loanPackage.getInterestRate() / 100) * time;
        loan.setTotalPayment(loanPackage.getAmount() + interest);
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
                .orElseThrow(() -> new RuntimeException("Loan not found!"));
    }

    @Override
    public List<Loan> getLoansByFarmer(Long nationalId, String status) {
        return loanRepository.findByFarmerNationalIdAndStatus(nationalId, status);
    }

    @Override
    public Loan updateLoanStatus(String loanCode, String status) {
        Loan loan = loanRepository.findByLoanPackage_LoanCode(loanCode)
                .orElseThrow(() -> new RuntimeException("Loan not found!"));
        loan.setStatus(LoanStatus.valueOf(status.trim().toUpperCase()));
        return loanRepository.save(loan);
    }

    @Override
    public Loan payLoan(Long id) {
        Loan loan = getLoansById(id);
        LocalDateTime now = LocalDateTime.now();
        loan.setDueDate(now);
        loan.setTotalPayment(loan.calculateTotalDue(now));
        loan.setStatus(LoanStatus.PENDING);
        return loanRepository.save(loan);
    }

    @Override
    public void deleteLoan(Long id) {
        Loan loan = getLoansById(id);
        loanRepository.delete(loan);
    }

    // ─── New implementations ──────────────────────────────────────────────────

    /**
     * Called by GET /api/loans/applications/me
     *
     * The JWT subject is the user's email address (set in AuthServiceImpl.login).
     * We look up the farmer by email, then return all their loans as DTOs.
     *
     * NOTE: This requires FarmerRepository to have:
     *   Optional<Farmer> findByEmail(String email);
     */
    @Override
    public List<ApplicationResponse> getApplicationsByUsername(String email) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for email: " + email));

        // reuse existing repo method — pass null status to get all loans regardless of status
        return loanRepository.findByFarmerNationalIdAndStatus(farmer.getNationalId(), null)
                .stream()
                .map(this::toApplicationResponse)
                .toList();
    }

    /**
     * Called by POST /api/loans/apply
     *
     * The frontend sends a loanProductId (which is the loanCode) and the
     * season is resolved directly from the LoanPackage — no seasonId needed
     * from the frontend.
     */
    @Override
    public ApplicationResponse applyFromFrontend(String email, ApplyRequest request) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found for email: " + email));

        // loanProductId from the frontend is the loanCode (String PK on LoanPackage)
        LoanPackage pkg = loanPackageRepository.findById(request.loanProductId())
                .orElseThrow(() -> new RuntimeException(
                        "Loan package not found: " + request.loanProductId()));

        // Season is already on the LoanPackage — no separate lookup needed
        Long seasonId = pkg.getFarmingSeason().getId();

        Loan created = createLoanFromPackage(farmer.getNationalId(), pkg.getLoanCode(), seasonId);
        return toApplicationResponse(created);
    }

    // ─── Private helper ───────────────────────────────────────────────────────

    /**
     * Maps a Loan entity to the ApplicationResponse DTO the frontend expects.
     *
     * LoanPackage has no name field so we use loanCode as the display value.
     * If you add a name field to LoanPackage later, swap getLoanCode() for getName().
     */
    private ApplicationResponse toApplicationResponse(Loan loan) {
        String loanName = loan.getLoanPackage() != null
                ? loan.getLoanPackage().getLoanCode()
                : "—";

        String applied = loan.getCreatedAt() != null
                ? loan.getCreatedAt().format(DISPLAY_DATE)
                : "—";

        String due = loan.getDueDate() != null
                ? loan.getDueDate().format(DISPLAY_DATE)
                : "—";

        return new ApplicationResponse(
                loan.getId(),
                loanName,
                (long) loan.getAmount(),   // double → long, KES has no decimals in display
                applied,
                loan.getStatus().name(),   // e.g. "PENDING", "APPROVED"
                due
        );
    }
}