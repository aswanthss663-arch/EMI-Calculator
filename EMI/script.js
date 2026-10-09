
const loanAmount = document.getElementById("loanAmount");
const interestRate = document.getElementById("interestRate");
const loanTenure = document.getElementById("loanTenure");

const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

const monthlyEMI = document.getElementById("monthlyEMI");
const totalInterest = document.getElementById("totalInterest");
const totalPayment = document.getElementById("totalPayment");
const errorMessage = document.getElementById("errorMessage");

// Format values as Indian Rupees
function formatCurrency(amount) {
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Validate inputs and calculate EMI
function calculateEMI() {
    const principal = Number(loanAmount.value);
    const annualRate = Number(interestRate.value);
    const years = Number(loanTenure.value);

    // Check for empty fields
    if (
        loanAmount.value.trim() === "" ||
        interestRate.value.trim() === "" ||
        loanTenure.value.trim() === ""
    ) {
        showError("Please fill in all the fields.");
        return;
    }

    // Check for invalid values
    if (!Number.isFinite(principal) ||
        !Number.isFinite(annualRate) ||
        !Number.isFinite(years) ||
        principal <= 0 ||
        annualRate < 0 ||
        years <= 0) {
        showError(
            "Enter a positive loan amount and tenure, and a non-negative interest rate."
        );
        return;
    }

    const months = Math.round(years * 12);

    if (months < 1) {
        showError("Loan tenure must be at least one month.");
        return;
    }

    if (months > 1200) {
        showError("Loan tenure cannot exceed 100 years.");
        return;
    }

    const monthlyRate = annualRate / 12 / 100;

    let emi;

    // Handle zero interest separately
    if (monthlyRate === 0) {
        emi = principal / months;
    } else {
        const factor = Math.pow(1 + monthlyRate, months);

        emi = principal * monthlyRate * factor / (factor - 1);
    }

    const total = emi * months;
    const interest = total - principal;

    if (
        !Number.isFinite(emi) ||
        !Number.isFinite(total) ||
        !Number.isFinite(interest)
    ) {
        showError("Unable to calculate. Please check your input values.");
        return;
    }

    // Update the repayment summary
    monthlyEMI.textContent = formatCurrency(emi);
    totalInterest.textContent = formatCurrency(interest);
    totalPayment.textContent = formatCurrency(total);

    errorMessage.textContent = "";
}

// Display validation errors
function showError(message) {
    errorMessage.textContent = message;

    monthlyEMI.textContent = "₹0.00";
    totalInterest.textContent = "₹0.00";
    totalPayment.textContent = "₹0.00";
}

// Calculate when the button is clicked
calculateBtn.addEventListener("click", calculateEMI);

// Update results dynamically when inputs change
[loanAmount, interestRate, loanTenure].forEach(function (input) {
    input.addEventListener("input", function () {
        errorMessage.textContent = "";

        if (
            loanAmount.value.trim() !== "" &&
            interestRate.value.trim() !== "" &&
            loanTenure.value.trim() !== ""
        ) {
            calculateEMI();
        } else {
            monthlyEMI.textContent = "₹0.00";
            totalInterest.textContent = "₹0.00";
            totalPayment.textContent = "₹0.00";
        }
    });
});

// Reset all fields and results
resetBtn.addEventListener("click", function () {
    loanAmount.value = "";
    interestRate.value = "";
    loanTenure.value = "";

    errorMessage.textContent = "";
    monthlyEMI.textContent = "₹0.00";
    totalInterest.textContent = "₹0.00";
    totalPayment.textContent = "₹0.00";
});