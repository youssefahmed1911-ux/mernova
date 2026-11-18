
# Mernova Backend — Testing Documentation

**Tested by:** Adam Mohamed  
**Test date:** November 18, 2026

## 1. Backend Setup

The backend was tested using a fresh clone of the main branch.

Commands used:

```powershell
git clone https://github.com/youssefahmed1911-ux/mernova.git
cd mernova/backend
npm install
```

Result: Dependencies installed successfully with 0 vulnerabilities reported.

## 2. Environment Configuration

Created a local `.env` file from `.env.example` using:

```powershell
Copy-Item .env.example .env
```

Configured the following environment variables:

```dotenv
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<your local secret>
```

The real `.env` file must never be uploaded to GitHub.

## 3. Backend Startup

Initially, running:

```powershell
npm start
```

Failed with:

```text
MongoDB connection failed: querySrv EBADRESP
```

Windows DNS lookup succeeded, but Node.js failed to resolve the MongoDB SRV record using its default DNS resolver.

The following workaround was used:

```powershell
node -e "require('dns').setServers(['8.8.8.8','1.1.1.1']); require('./server.js')"
```

After applying this workaround, the terminal displayed:

```text
MongoDB connected
Mernova backend listening on port 3000
```

## 4. Health Endpoint Testing

The endpoint was tested using:

```powershell
curl.exe -i http://localhost:3000/api/health
```

Expected and actual results:

- HTTP status: 200 OK
- Endpoint: GET /api/health
- JSON response: `{"status":"ok"}`

The health check passed successfully.

## 5. Test Results

| Test | Result |
|---|---|
| Clone repository from main | PASS |
| npm install | PASS |
| npm start with default DNS | FAIL — EBADRESP |
| MongoDB connection with DNS workaround | PASS |
| Express server on port 3000 | PASS |
| GET /api/health | PASS |
| HTTP 200 OK | PASS |
| JSON response {"status":"ok"} | PASS |

## 6. Conclusion

The backend successfully connected to MongoDB, started on port 3000, and returned the expected health-check response.

The original npm start command failed due to a DNS resolution issue on the testing machine. The backend worked after using alternative DNS servers.

The DNS issue should be reported to Youssef Shaaban and Hamza Mohamed for investigation.

**Overall result:** Backend functionality verified using the DNS workaround. Standard startup remains unresolved on the test machine.
