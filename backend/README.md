
# Mernova Backend — Testing Documentation

**Tested by:** Adam Mohamed  
**Test Date:** November 18, 2026

## 1. Backend Setup

The backend was tested using a fresh clone of the `main` branch.

### Installation Steps

Clone the repository:

```powershell
git clone https://github.com/youssefahmed1911-ux/mernova.git
```

Navigate to the backend directory:

```powershell
cd mernova/backend
```

Install the required dependencies:

```powershell
npm install
```

**Result:** PASS — Dependencies installed successfully with 0 vulnerabilities reported.

## 2. Environment Configuration

Create a local `.env` file from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Configure the required variables:

```dotenv
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your local secret>
```

The `.env` file contains sensitive information and must never be committed to GitHub.

## 3. Backend Startup Testing

Initially, the standard startup command:

```powershell
npm start
```

Failed with the following error:

```text
MongoDB connection failed: querySrv EBADRESP
```

The error was related to DNS resolution of MongoDB Atlas SRV records.

### DNS Investigation

The following tests were performed:

- Windows `nslookup`: PASS
- Node.js DNS lookup using default DNS servers: FAIL
- Node.js DNS lookup using Google and Cloudflare DNS: PASS

This indicated a DNS resolver issue on the testing machine.

### DNS Solution

A temporary DNS configuration was created outside the project directory:

```powershell
"require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);" | Set-Content "$env:TEMP\mernova-dns.cjs"
```

The Node.js environment was configured to load the temporary file:

```powershell
$env:NODE_OPTIONS="--require=$env:TEMP\mernova-dns.cjs"
```

The backend was then started using:

```powershell
npm start
```

**Result: PASS**

The terminal confirmed:

```text
MongoDB connected
Mernova backend listening on port 3000
```

This solution did not require modifying the backend source code or Windows DNS settings.

To remove the temporary Node.js configuration from the current PowerShell session:

```powershell
Remove-Item Env:NODE_OPTIONS
```

## 4. Health Endpoint Testing

The backend health endpoint was tested using:

```powershell
curl.exe -i http://localhost:3000/api/health
```

The verified HTTP status was:

```text
HTTP/1.1 200 OK
```

The verified JSON response was:

```json
{"status":"ok"}
```

**Result: PASS**

The health endpoint returned the expected response successfully.

## 5. Test Results

| Test | Result |
|---|---|
| Fresh clone of main | PASS |
| npm install | PASS |
| npm start using default DNS | FAIL — EBADRESP |
| Windows MongoDB DNS lookup | PASS |
| Node.js DNS lookup using default DNS | FAIL |
| Node.js DNS lookup using alternative DNS | PASS |
| npm start with temporary DNS configuration | PASS |
| MongoDB connection | PASS |
| Express server running on port 3000 | PASS |
| GET /api/health | PASS |
| HTTP response 200 OK | PASS |
| JSON response {"status":"ok"} | PASS |

## 6. Conclusion

The Mernova backend was successfully tested.

The backend connected to MongoDB Atlas and started an Express server on port 3000.

An initial DNS resolution error prevented normal startup using the default DNS configuration. The issue was resolved for the testing session by configuring alternative DNS servers through `NODE_OPTIONS`.

The health endpoint returned HTTP 200 OK with the expected JSON response.

**Overall Result:** PASS — Backend startup and health endpoint successfully verified using the documented DNS configuration.

**Note:** The default DNS resolution issue remains unresolved on the testing machine and should be reported to the backend developers.

**Tested by:** Adam Mohamed
