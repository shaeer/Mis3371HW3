
// Utility to display messages
function setMessage(id, msg, ok = false) {
    const span = document.getElementById(id + "_msg");
    const field = document.getElementById(id);
    if (span) span.textContent = msg;
    if (field) field.style.borderColor = ok ? "" : "red";
    if (ok && span) span.textContent = "";
    return ok;
}

// Name validator (First/Last)
function validateName(id) {
    const val = document.getElementById(id).value.trim();
    const ok = /^[A-Za-z'\-]{1,30}$/.test(val);
    return setMessage(id, ok ? "" : "Must be 1–30 letters, apostrophes, or dashes only.", ok);
}

// Middle Initial
function validateMiddleInitial() {
    const val = document.getElementById("midinitial").value.trim();
    const ok = val === "" || /^[A-Za-z]$/.test(val);
    return setMessage("midinitial", ok ? "" : "1 letter only", ok);
}

// DOB (must be within 120 years and not in the future)
function validateDOB() {
    const dobEl = document.getElementById("dob");
    const val = dobEl.value;
    if (!val) return setMessage("dob", "Date of birth is required", false);
    const dob = new Date(val);
    const now = new Date();
    const oldest = new Date();
    oldest.setFullYear(now.getFullYear() - 120);
    const ok = dob <= now && dob >= oldest;
    return setMessage("dob", ok ? "" : "Must be within last 120 years and not in the future", ok);
}

// SSN formatting and validation
function formatSSN() {
    const el = document.getElementById("ssn");
    let val = el.value.replace(/[^\d]/g, "").substring(0, 9);
    let formatted = "";
    if (val.length >= 3) formatted += val.substring(0, 3) + "-";
    if (val.length >= 5) formatted += val.substring(3, 5) + "-";
    if (val.length > 5) formatted += val.substring(5);
    else if (val.length > 3) formatted += val.substring(3);
    else formatted += val.substring(0);
    el.value = formatted;
    validateSSN();
}
function validateSSN() {
    const val = document.getElementById("ssn").value;
    const ok = /^\d{3}-\d{2}-\d{4}$/.test(val);
    return setMessage("ssn", ok ? "" : "Format: ###-##-####", ok);
}

// Address Line (required or optional)
function validateAddress(id, required = true) {
    const val = document.getElementById(id).value.trim();
    const ok = (!required && val === "") || /^[A-Za-z0-9 .,'#-]{2,30}$/.test(val);
    return setMessage(id, ok ? "" : "2–30 chars (letters/numbers/symbols)", ok);
}

// City
function validateCity() {
    const val = document.getElementById("city").value.trim();
    const ok = /^[A-Za-z .'-]{2,30}$/.test(val);
    return setMessage("city", ok ? "" : "2–30 letters or symbols", ok);
}

// State
function validateState() {
    const val = document.getElementById("state").value;
    return setMessage("state", val ? "" : "Select a state", !!val);
}

// Zip
function validateZip() {
    const val = document.getElementById("zip").value.trim();
    const ok = /^\d{5}$/.test(val);
    return setMessage("zip", ok ? "" : "5 digits only", ok);
}

// Email
function validateEmail() {
    const val = document.getElementById("email").value.trim().toLowerCase();
    const ok = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(val);
    document.getElementById("email").value = val;
    return setMessage("email", ok ? "" : "Must be in format name@domain.tld", ok);
}

// User ID
function validateUserID() {
    const val = document.getElementById("userid").value.trim();
    const ok = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(val);
    return setMessage("userid", ok ? "" : "5–20 chars, letters/numbers/-/_ only, starts with letter", ok);
}

// Password validation
function validatePasswords() {
    const p1 = document.getElementById("password").value;
    const p2 = document.getElementById("repassword").value;
    const uid = document.getElementById("userid").value.trim().toLowerCase();

    let ok = true;
    let msg = "";

    if (p1.length < 8) { msg = "At least 8 characters."; ok = false; }
    else if (!/[A-Z]/.test(p1) || !/[a-z]/.test(p1) || !/\d/.test(p1)) {
        msg = "Must contain upper, lower, and digit."; ok = false;
    } else if (p1.toLowerCase() === uid) {
        msg = "Cannot match User ID."; ok = false;
    } else if (p1 !== p2) {
        msg = "Passwords must match."; ok = false;
    }

    setMessage("password", msg, ok);
    setMessage("repassword", "", ok);
    return ok;
}

// Global check
function validateAllFields() {
    const ok = [
        validateName("firstname"),
        validateMiddleInitial(),
        validateName("lastname"),
        validateDOB(),
        validateSSN(),
        validateAddress("address1", true),
        validateAddress("address2", false),
        validateCity(),
        validateState(),
        validateZip(),
        validateEmail(),
        validateUserID(),
        validatePasswords()
    ].every(v => v);

    document.getElementById("submitBtn").disabled = !ok;
    return ok;
}

// Attach listeners for live validation
window.addEventListener("DOMContentLoaded", () => {
    const map = {
        firstname: validateName,
        midinitial: validateMiddleInitial,
        lastname: validateName,
        dob: validateDOB,
        ssn: formatSSN,
        address1: () => validateAddress("address1", true),
        address2: () => validateAddress("address2", false),
        city: validateCity,
        state: validateState,
        zip: validateZip,
        email: validateEmail,
        userid: validateUserID,
        password: validatePasswords,
        repassword: validatePasswords
    };

    for (const [id, fn] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("input", fn);
            el.addEventListener("blur", fn);
        }
    }

    document.getElementById("validateBtn").addEventListener("click", validateAllFields);
    document.getElementById("profileForm").addEventListener("submit", (e) => {
        if (!validateAllFields()) e.preventDefault();
    });
});
