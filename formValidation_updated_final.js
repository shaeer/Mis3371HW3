
// --- Utility Functions ---
function showError(fieldId, message) {
    alert("Error in " + fieldId + ": " + message);
    return false;
}

function validateName(id) {
    const value = document.getElementById(id).value.trim();
    const regex = /^[A-Za-z'-]{1,30}$/;
    if (!regex.test(value)) return showError(id, "Must be 1–30 letters, apostrophes, or dashes only.");
    return true;
}

function validateMiddleInitial() {
    const value = document.getElementById("midinitial").value.trim();
    return value === "" || /^[A-Za-z]{1}$/.test(value);
}

function validateDOB() {
    const dob = new Date(document.getElementById("dob").value);
    const now = new Date();
    const oldest = new Date();
    oldest.setFullYear(now.getFullYear() - 120);
    if (dob > now || dob < oldest) return showError("dob", "Enter a valid DOB (not in future or >120 years ago).");
    return true;
}

function validateSSN() {
    const field = document.getElementById("ssn");
    let value = field.value.replace(/[^\d]/g, '');
    if (value.length !== 9) return showError("ssn", "SSN must be 9 digits.");
    value = value.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
    field.value = value;
    return true;
}

function validateEmail() {
    const value = document.getElementById("email").value.toLowerCase();
    const regex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!regex.test(value)) return showError("email", "Must be a valid email (name@domain.tld).");
    document.getElementById("email").value = value;
    return true;
}

function validateZip() {
    return truncateZip("zip") !== null;
}

function validateUserID() {
    const value = document.getElementById("userid").value.trim();
    const regex = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;
    if (!regex.test(value)) return showError("userid", "ID must be 5–20 chars, start with letter, and use only letters, digits, dash, underscore.");
    return true;
}

function validatePasswords() {
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;
    const userid = document.getElementById("userid").value.toLowerCase();

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const validLength = password.length >= 8;
    const notUserID = password.toLowerCase() !== userid;
    const matches = password === repassword;

    if (!validLength) {
        alert("Password must be at least 8 characters long.");
        return false;
    }
    if (!hasUpper || !hasLower || !hasDigit) {
        alert("Password must include at least one uppercase letter, one lowercase letter, and one digit.");
        return false;
    }
    if (!notUserID) {
        alert("Password cannot be the same as your User ID.");
        return false;
    }
    if (!matches) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}

function truncateZip(zipInputId) {
    const zipInput = document.getElementById(zipInputId);
    if (zipInput) {
        const zipValue = zipInput.value.trim();
        const zipMatch = zipValue.match(/^\d{5}/);
        if (zipMatch) {
            zipInput.value = zipMatch[0];
            return zipMatch[0];
        } else {
            alert("Please enter a valid ZIP code (e.g., 77002 or 77002-1234)");
            zipInput.focus();
            return null;
        }
    }
    return null;
}

function normalizeUserID() {
    const uidField = document.getElementById("userid");
    uidField.value = uidField.value.toLowerCase();
}

function validateAllFields() {
    const validations = [
        validateName('firstname'),
        validateName('lastname'),
        validateMiddleInitial(),
        validateDOB(),
        validateSSN(),
        validateEmail(),
        validateZip(),
        validateUserID(),
        validatePasswords()
    ];
    const allValid = validations.every(v => v === true);
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.style.display = allValid ? 'inline-block' : 'none';
    if (!allValid) alert("Fix errors to continue.");
    return allValid;
}

window.onload = function () {
    document.getElementById("userid").addEventListener("blur", normalizeUserID);
    document.getElementById("profileForm").addEventListener("submit", function (event) {
        if (!validateAllFields()) event.preventDefault();
    });
    document.getElementById("firstname").addEventListener("blur", () => validateName("firstname"));
    document.getElementById("lastname").addEventListener("blur", () => validateName("lastname"));
    document.getElementById("midinitial").addEventListener("blur", validateMiddleInitial);
    document.getElementById("dob").addEventListener("blur", validateDOB);
    document.getElementById("ssn").addEventListener("input", validateSSN);
    document.getElementById("email").addEventListener("blur", validateEmail);
    document.getElementById("zip").addEventListener("blur", () => truncateZip("zip"));
    document.getElementById("userid").addEventListener("blur", validateUserID);
    document.getElementById("password").addEventListener("blur", validatePasswords);
    document.getElementById("repassword").addEventListener("blur", validatePasswords);
};
