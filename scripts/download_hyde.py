#!/usr/bin/env python3
"""Acquire a HYDE population archive with provenance and checksum.

Usage:
  python scripts/download_hyde.py --url 'https://<official archive file>' --output data/raw/hyde-pop.zip
  python scripts/download_hyde.py --url '...' --output data/raw/hyde-pop.zip --sha256 EXPECTED_HEX

Supply the *specific* file URL selected from the official HYDE archive.
No guessed archive filenames or unaudited mirrors are hardcoded.
"""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", required=True, help="Exact HTTPS URL of an official HYDE archive")
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--sha256", help="Optional expected SHA-256 hash")
    args = parser.parse_args()
    if urlparse(args.url).scheme != "https":
        parser.error("Only HTTPS sources are accepted")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    partial = args.output.with_name(args.output.name + ".part")
    sha = hashlib.sha256()
    size = 0
    try:
        request = Request(args.url, headers={"User-Agent": "ghost-atlas-data-acquisition/0.1"})
        with urlopen(request, timeout=60) as response, partial.open("wb") as out:
            while chunk := response.read(1024 * 1024):
                out.write(chunk)
                sha.update(chunk)
                size += len(chunk)
        digest = sha.hexdigest()
        if args.sha256 and digest.lower() != args.sha256.lower():
            raise ValueError(f"SHA256 mismatch: received {digest}")
        partial.replace(args.output)
        provenance = {
            "source_url": args.url,
            "downloaded_at_utc": datetime.now(timezone.utc).isoformat(),
            "bytes": size,
            "sha256": digest,
            "file": str(args.output),
            "license": "NOT YET VERIFIED — check official dataset record",
        }
        Path(str(args.output) + ".provenance.json").write_text(
            json.dumps(provenance, indent=2) + "\n", encoding="utf-8"
        )
        print(json.dumps(provenance, indent=2))
    finally:
        partial.unlink(missing_ok=True)

if __name__ == "__main__":
    main()
