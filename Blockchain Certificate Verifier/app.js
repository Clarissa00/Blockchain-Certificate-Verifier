// app.js

let web3;
let contract;
let userAccount;

// Your deployed contract address (from Remix)
const contractAddress = "0x4fc8312c087c3a8aaaf411bc8b24d9895ffcbb47";

// Your ABI (from Remix)
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_id", "type": "string" },
      { "internalType": "string", "name": "_studentName", "type": "string" },
      { "internalType": "string", "name": "_courseName", "type": "string" },
      { "internalType": "string", "name": "_issueDate", "type": "string" },
      { "internalType": "string", "name": "_certHash", "type": "string" }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "certificates",
    "outputs": [
      { "internalType": "string", "name": "studentName", "type": "string" },
      { "internalType": "string", "name": "courseName", "type": "string" },
      { "internalType": "string", "name": "issueDate", "type": "string" },
      { "internalType": "string", "name": "certHash", "type": "string" },
      { "internalType": "bool", "name": "isValid", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "verifyCertificate",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 🔹 Load & Connect MetaMask
window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    document.getElementById("walletAddress").innerText = "Connected: " + userAccount;

    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("✅ Connected to contract:", contractAddress);
  } else {
    alert("Please install MetaMask to use this DApp!");
  }
});

// 🔹 Issue Certificate
document.getElementById("issueBtn").addEventListener("click", async () => {
  const id = document.getElementById("issueId").value.trim();
  const student = document.getElementById("studentName").value.trim();
  const course = document.getElementById("course").value.trim();
  const date = document.getElementById("issueDate").value.trim();
  const hash = document.getElementById("certHash").value.trim() || "hash" + Math.random().toString(36).substring(7);

  if (!id || !student || !course || !date) {
    alert("⚠️ Please fill all fields before issuing!");
    return;
  }

  try {
    await contract.methods.issueCertificate(id, student, course, date, hash)
      .send({ from: userAccount });
    alert("✅ Certificate Issued Successfully!");
  } catch (error) {
    console.error("❌ Error issuing certificate:", error);
    alert("❌ Transaction Failed! Check console for details.");
  }
});

// 🔹 Verify Certificate
document.getElementById("verifyBtn").addEventListener("click", async () => {
  const id = document.getElementById("verifyId").value.trim();
  const out = document.getElementById("verifyResult");
  out.innerHTML = "⏳ Verifying...";

  if (!id) {
    out.innerHTML = "❗ Please enter a Certificate ID.";
    return;
  }

  try {
    const result = await contract.methods.verifyCertificate(id).call();
    console.log("verify result:", result);

    const studentName = result[0];
    const courseName  = result[1];
    const issueDate   = result[2];
    const certHash    = result[3];
    const valid       = result[4];

    if (valid) {
      out.innerHTML = `
        ✅ <b>Certificate Verified!</b><br>
        <b>Name:</b> ${studentName}<br>
        <b>Course:</b> ${courseName}<br>
        <b>Issue Date:</b> ${issueDate}<br>
        <b>Hash:</b> ${certHash}
      `;
    } else {
      out.innerHTML = `❌ Invalid or Revoked Certificate (ID: ${id})`;
    }
  } catch (error) {
    console.error("Verification error:", error);
    out.innerHTML = "⚠️ Verification failed — check console for details.";
  }
});

// 🔹 Revoke Certificate
document.getElementById("revokeBtn").addEventListener("click", async () => {
  const id = document.getElementById("revokeId").value.trim();
  if (!id) {
    alert("⚠️ Please enter a Certificate ID to revoke!");
    return;
  }

  try {
    await contract.methods.revokeCertificate(id).send({ from: userAccount });
    alert("⚠️ Certificate Revoked!");
  } catch (error) {
    console.error("❌ Error revoking certificate:", error);
    alert("❌ Failed to revoke certificate.");
  }
});
