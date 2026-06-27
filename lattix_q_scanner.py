#!/usr/bin/env python3
import os
import re
import sys
import argparse
import json

# Regex patterns matching backend scanner patterns
PATTERNS = {
    "RSA": r"(RSA\.generate|RSA\.import_key|asymmetric\.rsa)",
    "ECC": r"(ECC\.generate|asymmetric\.ec|ECDSA)",
    "MD5": r"(hashlib\.md5|MD5\.new)",
    "SHA1": r"(hashlib\.sha1|SHA1\.new)",
    "DES": r"(DES\.new|DES3\.new)",
    "HardcodedKey": r"(api_key|secret_key|private_key)\s*=\s*['\"][a-zA-Z0-9]{32,}['\"]"
}

SUGGESTIONS = {
    "RSA": "Migrate to Kyber-768 or Dilithium-2 (ML-KEM/ML-DSA).",
    "ECC": "Migrate to Dilithium or SPHINCS+ for signatures.",
    "MD5": "Use SHA-256 or SHA-3 for non-quantum-resistant hashing; use TupleHash for QR hashing.",
    "SHA1": "Upgrade to SHA-3-256.",
    "DES": "Upgrade to AES-256 or a quantum-resistant symmetric cipher.",
    "HardcodedKey": "Use a secrets manager (Vault/AWS Secrets Manager) and avoid hardcoded keys."
}

def scan_file(file_path):
    findings = []
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.split('\n')
            for line_num, line in enumerate(lines, 1):
                for tech, pattern in PATTERNS.items():
                    if re.search(pattern, line):
                        risk = "High" if tech in ["RSA", "ECC", "MD5", "SHA1", "DES"] else "Medium"
                        findings.append({
                            "file": file_path,
                            "line": line_num,
                            "technology": tech,
                            "content": line.strip(),
                            "risk": risk,
                            "suggestion": SUGGESTIONS.get(tech, "Upgrade to post-quantum equivalent.")
                        })
    except Exception as e:
        print(f"[ERROR] Failed to read {file_path}: {e}")
    return findings

def main():
    parser = argparse.ArgumentParser(description="Lattix-Q Headless CLI Scanner for Cryptographic Audit")
    parser.add_argument("--path", default=".", help="Directory or file path to scan")
    parser.add_argument("--output", help="Path to write JSON output report")
    parser.add_argument("--fail-on-high", action="store_true", help="Exit with code 1 if High risk ciphers are found")
    
    args = parser.parse_args()
    
    print("=" * 60)
    print(" LATTIX-Q CRYPTOGRAPHIC AUDIT CLI SCANNER ")
    print("=" * 60)
    print(f"Scanning target path: {args.path}")
    
    all_findings = []
    
    if os.path.isfile(args.path):
        all_findings.extend(scan_file(args.path))
    elif os.path.isdir(args.path):
        exclude_dirs = {".git", "node_modules", "venv", "__pycache__", "dist", "build", "tests", "test"}
        for root, dirs, files in os.walk(args.path):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file.endswith(('.py', '.js', '.jsx', '.ts', '.tsx', '.go', '.java', '.cpp', '.h', '.cs')):
                    if file == "lattix_q_scanner.py" or "test" in file.lower():
                        continue
                    file_path = os.path.join(root, file)
                    all_findings.extend(scan_file(file_path))
                    
    print(f"Scan complete. Found {len(all_findings)} finding(s).\n")
    
    high_count = 0
    medium_count = 0
    
    for f in all_findings:
        color = "\033[91m" if f["risk"] == "High" else "\033[93m"
        reset = "\033[0m"
        print(f"[{color}{f['risk']}{reset}] {f['file']}:{f['line']} - Detected {f['technology']}")
        print(f"  Code: {f['content']}")
        print(f"  Suggestion: {f['suggestion']}")
        print("-" * 60)
        
        if f["risk"] == "High":
            high_count += 1
        else:
            medium_count += 1
            
    if args.output:
        try:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump({
                    "findings": all_findings,
                    "summary": {
                        "total": len(all_findings),
                        "high": high_count,
                        "medium": medium_count
                    }
                }, f, indent=2)
            print(f"JSON report written to: {args.output}")
        except Exception as e:
            print(f"Failed to write JSON output: {e}")
            
    if args.fail_on_high and high_count > 0:
        print("\033[91m[AUDIT FAILED] High risk classical cryptography detected in codebase.\033[0m")
        sys.exit(1)
        
    print("\033[92m[AUDIT PASSED] No critical PQC migration blockages found.\033[0m")
    sys.exit(0)

if __name__ == "__main__":
    main()
