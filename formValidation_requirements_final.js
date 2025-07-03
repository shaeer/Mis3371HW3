
/* === Robust Validation for Homework 3 === */
/* Shows inline messages and disables submit until everything valid */

/* Helper to set message (& colour) */
function setMsg(id, ok, msg=""){
  const span = document.getElementById(id+"_msg");
  if(!span) return ok;
  span.textContent = ok ? "" : msg;
  document.getElementById(id).style.borderColor = ok ? "" : "red";
  return ok;
}

/* Name fields (first / last) */
function validateName(id){
  const v = document.getElementById(id).value.trim();
  const ok = /^[A-Za-z'\-]{1,30}$/.test(v);
  return setMsg(id, ok, "1–30 letters, ' or - only");
}

/* Middle initial (optional one letter) */
function validateMI(){
  const v = document.getElementById("midinitial").value.trim();
  const ok = v==="" || /^[A-Za-z]$/.test(v);
  return setMsg("midinitial", ok, "1 letter only");
}

/* DOB */
function validateDOB(){
  const el = document.getElementById("dob");
  if(el.value==="") return setMsg("dob", false, "Required");
  const dob = new Date(el.value);
  const now = new Date();
  const oldest = new Date(); oldest.setFullYear(now.getFullYear()-120);
  const ok = dob<=now && dob>=oldest;
  return setMsg("dob", ok, "Must be within last 120 years, not future");
}

/* SSN with format ###-##-#### */
function ssnFormat(){
  const el = document.getElementById("ssn");
  let digits = el.value.replace(/\D/g,"").slice(0,9);
  if(digits.length>5) el.value = digits.replace(/(\d{3})(\d{2})(\d{0,4})/, "$1-$2-$3");
  else if(digits.length>3) el.value = digits.replace(/(\d{3})(\d{0,2})/, "$1-$2");
  else el.value = digits;
}
function validateSSN(){
  const ok = /^\d{3}-\d{2}-\d{4}$/.test(document.getElementById("ssn").value);
  return setMsg("ssn", ok, "9 digits (###-##-####)");
}

/* Address lines */
function validateAddress(id, required){
  const v=document.getElementById(id).value.trim();
  const ok = (!required && v==="") || /^[A-Za-z0-9 .,'#-]{2,30}$/.test(v);
  return setMsg(id, ok, "2–30 valid chars");
}

/* City */
function validateCity(){
  const v=document.getElementById("city").value.trim();
  const ok=/^[A-Za-z .'-]{2,30}$/.test(v);
  return setMsg("city", ok, "2–30 letters / - '");
}

/* State dropdown */
function validateState(){
  const ok=document.getElementById("state").value!=="";
  return setMsg("state", ok, "Select state");
}

/* ZIP */
function validateZIP(){
  const v=document.getElementById("zip").value.trim();
  const ok=/^\d{5}$/.test(v);
  return setMsg("zip", ok, "5 digits");
}

/* Email */
function validateEmail(){
  const el=document.getElementById("email");
  el.value=el.value.trim().toLowerCase();
  const ok=/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(el.value);
  return setMsg("email", ok, "name@domain.tld");
}

/* User ID */
function validateUID(){
  const v=document.getElementById("userid").value.trim();
  const ok=/^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(v);
  return setMsg("userid", ok, "5–20 chars, start w/ letter");
}

/* Password */
function validatePW(){
  const p=document.getElementById("password").value;
  const r=document.getElementById("repassword").value;
  const uid=document.getElementById("userid").value.trim().toLowerCase();
  let ok=true, msg="";
  if(p.length<8){ok=false; msg="≥8 chars";}
  else if(!/[A-Z]/.test(p)||!/[a-z]/.test(p)||!/\d/.test(p)){ok=false; msg="Need upper, lower, digit";}
  else if(p.toLowerCase()===uid){ok=false; msg="Cannot equal User ID"; }
  else if(p!==r){ok=false; msg="Passwords must match";}
  setMsg("password", ok, msg);
  setMsg("repassword", ok, "");
  return ok;
}

/* Master */
function master(){
  const all = [
    validateName("firstname"),
    validateName("lastname"),
    validateMI(),
    validateDOB(),
    validateSSN(),
    validateAddress("address1",true),
    validateAddress("address2",false),
    validateCity(),
    validateState(),
    validateZIP(),
    validateEmail(),
    validateUID(),
    validatePW()
  ].every(Boolean);
  document.getElementById("submitBtn").disabled=!all;
  return all;
}

/* Attach events */
document.addEventListener("DOMContentLoaded", ()=>{
  const map = {
    firstname:()=>validateName("firstname"),
    lastname:()=>validateName("lastname"),
    midinitial:validateMI,
    dob:validateDOB,
    ssn:()=>{ssnFormat(); validateSSN();},
    address1:()=>validateAddress("address1",true),
    address2:()=>validateAddress("address2",false),
    city:validateCity,
    state:validateState,
    zip:validateZIP,
    email:validateEmail,
    userid:()=>{validateUID(); validatePW();},
    password:validatePW,
    repassword:validatePW
  };
  for(const id in map){
    const el=document.getElementById(id);
    if(el){
      el.addEventListener("input", map[id]);
      el.addEventListener("blur", map[id]);
    }
  }
  document.getElementById("validateBtn").addEventListener("click", master);
  document.getElementById("profileForm").addEventListener("submit",(e)=>{ if(!master()) e.preventDefault();});
});
