<p align="center">
  <img src="assets/lattix_q_logo.png" alt="Lattix-Q Logo" width="180" height="180" style="border-radius: 24px; box-shadow: 0 8px 30px rgba(0,196,232,0.2);" />
</p>

<h1 align="center">Lattix - Q</h1>
<p align="center"><b>Enterprise Post-Quantum Cryptography (PQC) Migration & Risk Assessment Platform</b></p>

<p align="center">
  An advanced, premium cybersecurity dashboard that inventories legacy cryptographic assets, simulates Shor's and Grover's quantum attacks, profiles post-quantum lattice-based algorithms, and automates PQC transition auditing.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python" alt="Python Version" />
  <img src="https://img.shields.io/badge/React-18.0-cyan?style=flat-square&logo=react" alt="React Version" />
  <img src="https://img.shields.io/badge/FastAPI-0.100-green?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Qiskit-1.x-purple?style=flat-square&logo=qiskit" alt="Qiskit Version" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker" alt="Docker Ready" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square" alt="Status" />
</p>

<p align="center">
  <a href="#key-features-at-a-glance">Key Features</a> •
  <a href="#project-overview--problem-statement">Overview & Context</a> •
  <a href="#microservices-architecture">Architecture</a> •
  <a href="#supported-cryptographic-algorithms">Supported PQC Algorithms</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#troubleshooting">Troubleshooting</a>
</p>

---

## Key Features at a Glance

| Quantum Attack Lab | AI Code Scanner | Crypto Workbench | Compliance & Reports |
| :--- | :--- | :--- | :--- |
| Simulate factorization and key-recovery using Shor's and Grover's algorithms. | Scan source code repositories to locate legacy cipher suites and auto-apply patches. | Run real-time performance benchmarks comparing classical ciphers vs. PQC ciphers. | Generate professional PDF reports scoring transition maturity against NIST mandates. |

---

## Table of Contents

* [Key Features at a Glance](#key-features-at-a-glance)
* [Project Overview & Problem Statement](#project-overview--problem-statement)
* [Microservices Architecture](#microservices-architecture)
* [Core Capabilities & Modules](#core-capabilities--modules)
* [Supported Cryptographic Algorithms](#supported-cryptographic-algorithms)
* [Quick Start](#quick-start)
* [Troubleshooting](#troubleshooting)
* [License](#license)
* [Contributing & Feedback](#contributing--feedback)
* [Show Your Support](#show-your-support)
* [Author & Contact](#author--contact)

---

## Project Overview & Problem Statement

### The Threat: Store Now, Decrypt Later (SNDL)
Modern secure data communications rely heavily on public-key cryptography (like **RSA** and **ECC**). However, quantum computers utilizing **Shor's Algorithm** will be capable of breaking these mathematical problems in the future. Adversaries are actively harvesting encrypted enterprise data today (**SNDL**) to decrypt it once cryptographically relevant quantum computers (CRQCs) emerge.

### The Mandate: Transition to Post-Quantum Cryptography (PQC)
Enterprises must transition immediately to lattice-based cryptographic algorithms. Government directives such as **NIST SP 800-219** and the **NSA Commercial National Security Algorithm Suite (CNSA 2.0)** mandate complete migration to post-quantum standards (ML-KEM, ML-DSA) by 2030-2033.

**Lattix-Q** solves this challenge by providing a centralized dashboard to:
1. **Assess risk**: Pinpoint legacy ciphers (RSA, ECC, 3DES) inside enterprise codebases.
2. **Profile algorithms**: Profile CPU/Memory metrics of new NIST-approved ciphers under different network loads.
3. **Simulate attacks**: Track simulated qubit scaling and attack complexities.

---

## Microservices Architecture

Lattix-Q uses a decoupled, containerized microservices mesh orchestrated via `docker-compose` and routed through an **Nginx reverse proxy** acting as a unified API Gateway.

```mermaid
flowchart TB
    %% Subgraphs representing styled containers
    subgraph UI ["Ingress & Frontend Portal"]
        Client["User Browser / CLI"]
        Nginx["Nginx Reverse Proxy (Port 80/443)"]
        Frontend["React Frontend Console (Port 3000)"]
    end

    subgraph GW ["Authentication & Gateway Core"]
        Gateway["API Gateway (Port 8000)"]
        Postgres[("PostgreSQL Database (Port 5432)")]
    end

    subgraph LAB ["Quantum & Cryptographic Services"]
        AttackSvc["Quantum Attack Engine (Port 8001)"]
        ClassicalSvc["Classical Crypto Audit (Port 8002)"]
        PQCSvc["PQC Algorithm Suite (Port 8003)"]
        BenchmarkSvc["Performance Benchmarking (Port 8004)"]
        ReportSvc["Compliance Report Engine (Port 8005)"]
        AISvc["AI Threat Analyst (Port 8006)"]
    end

    subgraph ASYNC ["Asynchronous Task Queue"]
        Redis["Redis Message Broker (Port 6379)"]
        CeleryWorker["Celery Simulation Worker"]
    end

    subgraph MON ["Observability Stack"]
        Prometheus["Prometheus Telemetry (Port 9090)"]
        Grafana["Grafana Dashboards (Port 3001)"]
    end

    %% Flow Connections
    Client --> Nginx
    Nginx -->|Routes static UI| Frontend
    Nginx -->|Routes API calls| Gateway
    
    Gateway -->|JWT Auth & DB Session| Postgres
    Gateway -->|API calls| LAB
    
    AttackSvc -->|Pub/Sub Trigger| Redis
    Redis -->|Process simulation| CeleryWorker
    
    Gateway -->|Collect metrics| Prometheus
    Prometheus -->|Visual dashboards| Grafana

    %% Node styling classes
    classDef uiClass fill:#1d3557,stroke:#457b9d,stroke-width:2px,color:#fff;
    classDef gwClass fill:#1b4d3e,stroke:#2d6a4f,stroke-width:2px,color:#fff;
    classDef dbClass fill:#7b1113,stroke:#9b2226,stroke-width:2px,color:#fff;
    classDef labClass fill:#4a148c,stroke:#7b1fa2,stroke-width:2px,color:#fff;
    classDef asyncClass fill:#e65100,stroke:#f57c00,stroke-width:2px,color:#fff;
    classDef monClass fill:#006064,stroke:#00838f,stroke-width:2px,color:#fff;

    class Client,Nginx,Frontend uiClass;
    class Gateway gwClass;
    class Postgres,Redis dbClass;
    class AttackSvc,ClassicalSvc,PQCSvc,BenchmarkSvc,ReportSvc,AISvc labClass;
    class CeleryWorker asyncClass;
    class Prometheus,Grafana monClass;

    %% Subgraph styling (dark containers)
    style UI fill:#18181b,stroke:#27272a,stroke-width:1px,color:#fff
    style GW fill:#18181b,stroke:#27272a,stroke-width:1px,color:#fff
    style LAB fill:#18181b,stroke:#27272a,stroke-width:1px,color:#fff
    style ASYNC fill:#18181b,stroke:#27272a,stroke-width:1px,color:#fff
    style MON fill:#18181b,stroke:#27272a,stroke-width:1px,color:#fff
```

---

## Core Capabilities & Modules

### 1. Quantum Attack Laboratory
* **Mathematical Emulation**: Emulate quantum period-finding (Shor's) and unstructured search (Grover's) algorithms.
* **Qubit Resource Estimation**: Calculate required physical and logical qubits needed to break ciphers based on key lengths.
* **IBM Quantum Cloud Integration**: Connect directly to Qiskit Runtime to run emulations on real hardware or Aer simulators.

### 2. AI Code Scanner (Batch Auditor)
* **Static AST Analysis**: Scan code files for hardcoded vulnerable ciphers (e.g. `MD5`, `SHA-1`, `RSA-1024`).
* **Auto-Patching Engine**: Propose secure replacements to modern standards (e.g., swapping RSA key exchange for Kyber KEM).
* **Scan History**: Retain complete cron audit logs of scheduled scans for compliance validation.

### 3. PQC Benchmark Center
* **Timing Profiling**: Profile execution speeds of key generation, encapsulation/signing, and decapsulation/verification.
* **Memory Footprint Assessment**: Compare ciphers under simulated network constraints to observe latency impacts.

---

## Supported Cryptographic Algorithms

Lattix-Q supports testing, benchmarking, and scanning configurations for the following cryptographic algorithms:

| Category | Algorithm | Standard / Specification | Security Strength |
| :--- | :--- | :--- | :--- |
| **PQC Key Encapsulation (KEM)** | **Kyber (ML-KEM)** | NIST FIPS 203 | NIST Levels 1, 3, 5 |
| **PQC Digital Signature** | **Dilithium (ML-DSA)** | NIST FIPS 204 | NIST Levels 2, 3, 5 |
| **PQC Digital Signature** | **Falcon** | NIST FIPS 205 | NIST Level 1 |
| **Classical Asymmetric** | **RSA** | PKCS #1 v2.2 | Vulnerable to Shor's |
| **Classical Asymmetric** | **ECC (ECDSA / ECDH)** | SECG SEC 2 | Vulnerable to Shor's |
| **Symmetric Cipher** | **AES** | FIPS 197 | AES-256 is Quantum-Safe (Grover-resistant) |

---

## Quick Start

### Prerequisites
Make sure your system has the following installed:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20.10+)
* [Docker Compose](https://docs.docker.com/compose/) (v2.0+)
* [Git](https://git-scm.com/)

### Running the Localhost Environment

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shlok926/Lattix-Q.git
   cd Lattix-Q
   ```

2. **Initialize Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to supply API keys (like Anthropic/OpenAI keys for the AI Analyst) if desired.*

3. **Build and Spin Up the Containers**:
   ```bash
   docker-compose up -d --build
   ```

4. **Access the Interfaces**:
   * **Web Console Dashboard**: [http://localhost](http://localhost) (or port 3000)
   * **API Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
   * **Grafana Monitoring Dashboard**: [http://localhost:3001](http://localhost:3001)

---

## Troubleshooting

### Port Conflicts
If you receive port conflict errors (e.g. port `80` or `3000` is already in use by another app):
1. Open `docker-compose.yml` in your editor.
2. Edit the external port mappings under the `nginx` or `frontend` blocks (e.g. change `"80:80"` to `"8080:80"`).
3. Re-run `docker-compose up -d`.

### Docker Daemon Not Running
If you see `error during connect: daemon not response`, make sure **Docker Desktop** is open and running on your taskbar before launching commands.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing & Feedback

Contributions, suggestions, and feedback are highly welcome!

* **Got suggestions or feature requests?** Feel free to open a new Issue or share your ideas.
* **Want to contribute?** Feel free to fork this repository, make your changes, and submit a Pull Request.

---

## Show Your Support

Love this tool? Help us grow:
* Star the repository (GitHub Star Button)
* Report bugs (GitHub Issues)
* Suggest features (GitHub Discussions)
* Share with others (LinkedIn/Twitter)
* Contribute code (Pull Requests)

---

## Author & Contact

<p align="center">
  <b>Shlok Thorat</b><br />
  <i>Let's connect on LinkedIn, collaborate, and build amazing things together!</i>
</p>

<p align="center">
  <a href="mailto:shlokthorat29075@gmail.com"><img src="https://img.shields.io/badge/Email-shlokthorat29075%40gmail.com-red?style=flat-square&logo=gmail" alt="Email" /></a>
  <a href="https://github.com/shlok926"><img src="https://img.shields.io/badge/GitHub-%40shlok926-black?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://linkedin.com/in/shlok-thorat-39916a405"><img src="https://img.shields.io/badge/LinkedIn-shlok--thorat--39916a405-blue?style=flat-square&logo=linkedin" alt="LinkedIn" /></a>
</p>

<p align="center">
  Made with 💖 by Shlok! for Cybersecurity Innovation • <a href="#lattix---q">Back to Top</a>
</p>
