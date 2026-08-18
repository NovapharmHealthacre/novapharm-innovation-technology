from __future__ import annotations

import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin

import requests

OUT = Path("uk_pharmacy_sources")
OUT.mkdir(parents=True, exist_ok=True)
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "NovaPharm-public-data-research/1.0 (+https://novapharmhealthcare.com)"})
TIMEOUT = 90


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def download(url: str, filename: str, *, allow_fail: bool = False) -> dict:
    target = OUT / filename
    try:
        r = SESSION.get(url, timeout=TIMEOUT, allow_redirects=True)
        r.raise_for_status()
        target.write_bytes(r.content)
        return {
            "name": filename,
            "source_url": url,
            "final_url": r.url,
            "status": r.status_code,
            "content_type": r.headers.get("content-type", ""),
            "bytes": target.stat().st_size,
            "sha256": sha256(target),
        }
    except Exception as exc:
        if not allow_fail:
            raise
        return {"name": filename, "source_url": url, "error": repr(exc)}


def extract_links(page_url: str, pattern: str) -> list[str]:
    r = SESSION.get(page_url, timeout=TIMEOUT)
    r.raise_for_status()
    hrefs = re.findall(r'''href=["']([^"']+)["']''', r.text, flags=re.I)
    rx = re.compile(pattern, re.I)
    return [urljoin(page_url, h) for h in hrefs if rx.search(h)]


def ckan_latest(dataset_url: str, name_regex: str) -> tuple[str, str] | None:
    slug = dataset_url.rstrip("/").split("/")[-1]
    api = f"https://opendata.nhsbsa.net/api/3/action/package_show?id={slug}"
    r = SESSION.get(api, timeout=TIMEOUT)
    r.raise_for_status()
    data = r.json()
    resources = data.get("result", {}).get("resources", [])
    rx = re.compile(name_regex, re.I)
    matches = [x for x in resources if rx.search(str(x.get("name", ""))) or rx.search(str(x.get("url", "")))]
    if not matches:
        return None
    # Prefer newest created timestamp, then last resource in the package.
    matches.sort(key=lambda x: (str(x.get("created", "")), int(x.get("position", 0))))
    res = matches[-1]
    return str(res.get("url", "")), str(res.get("name", "resource"))


def main() -> None:
    manifest: list[dict] = []

    # Current nightly/weekly ODS pharmacy/dispensary report: England, Wales and Isle of Man.
    manifest.append(download(
        "https://www.odsdatasearchandexport.nhs.uk/api/getReport?report=edispensary",
        "ods_edispensary_current.csv",
    ))

    # NHSBSA current monthly contractor file (July 2026), useful for contractor/legal/trading names and phone.
    manifest.append(download(
        "https://opendata.nhsbsa.net/dataset/d5954d7e-63cd-43d4-aa7e-4a489119f6a7/resource/d7084477-fb46-4727-85a7-b67355aad77a/download/contractor_details_202607.csv",
        "nhsbsa_contractor_details_202607.csv",
        allow_fail=True,
    ))

    # NHSBSA FOI release containing community-pharmacy NHS shared mailboxes held by NHSBSA (as of 3 Jun 2024).
    manifest.append(download(
        "https://opendata.nhsbsa.net/dataset/20999f82-173b-4f85-8fef-6cccb6e22ece/resource/61180293-aa09-49a1-aba7-73dd7da397c5/download/foi-01958-completed-request.csv",
        "england_nhs_shared_mailboxes_foi01958_20240603.csv",
    ))

    # Current validated England pharmaceutical list: discover latest 2026 resource from CKAN metadata.
    latest = ckan_latest(
        "https://opendata.nhsbsa.net/dataset/consolidated-pharmaceutical-list",
        r"2026|202627|2026-27|202606|Q1",
    )
    if latest:
        url, name = latest
        ext = ".csv" if ".csv" in url.lower() or "csv" in name.lower() else ".dat"
        manifest.append(download(url, f"england_consolidated_pharmaceutical_list_latest{ext}", allow_fail=True))
    else:
        manifest.append({"name": "england_consolidated_pharmaceutical_list_latest", "error": "No matching 2026 resource discovered"})

    # Scotland: latest published dispenser location contact details available when task was run.
    manifest.append(download(
        "https://www.opendata.nhs.scot/dataset/a30fde16-1226-49b3-b13d-eb90e39c2058/resource/c702a226-a084-4744-b513-17515b3d5950/download/dispenser_contactdetails_202604.csv",
        "scotland_dispenser_contactdetails_202604.csv",
    ))

    # Wales: save publication page and every linked pharmacy XLS/XLSX/CSV resource for later normalization.
    wales_page = "https://nwssp.nhs.wales/ourservices/primary-care-services/general-information/data-and-publications/pharmacies-in-wales/"
    manifest.append(download(wales_page, "wales_pharmacies_publication_page.html", allow_fail=True))
    try:
        links = extract_links(wales_page, r"pharmac.*\.(?:csv|xlsx?|xls)(?:\?|$)|\.(?:csv|xlsx?|xls)(?:\?|$)")
        seen = set()
        for i, url in enumerate(links, start=1):
            if url in seen:
                continue
            seen.add(url)
            clean = url.split("?")[0]
            suffix = Path(clean).suffix.lower() or ".bin"
            manifest.append(download(url, f"wales_linked_resource_{i:02d}{suffix}", allow_fail=True))
    except Exception as exc:
        manifest.append({"name": "wales_link_discovery", "source_url": wales_page, "error": repr(exc)})

    # Northern Ireland: current BSO pharmaceutical list page; discover latest Excel list dynamically.
    ni_page = "https://bso.hscni.net/pharmacy-support-links/pharmaceutical-list-current/"
    manifest.append(download(ni_page, "northern_ireland_pharmaceutical_list_page.html", allow_fail=True))
    try:
        ni_links = extract_links(ni_page, r"CurrentChemistsExcel.*\.xlsx(?:\?|$)|Pharm.*List.*\.xlsx(?:\?|$)")
        if not ni_links:
            ni_links = extract_links(ni_page, r"\.xlsx(?:\?|$)")
        for i, url in enumerate(dict.fromkeys(ni_links), start=1):
            manifest.append(download(url, f"northern_ireland_pharmaceutical_list_{i:02d}.xlsx", allow_fail=True))
    except Exception as exc:
        manifest.append({"name": "northern_ireland_link_discovery", "source_url": ni_page, "error": repr(exc)})

    # Preserve public-source metadata used to interpret the bundle.
    metadata = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "purpose": "Public UK pharmacy premises/contact dataset source bundle for NovaPharm Healthcare Ltd",
        "notes": [
            "No Clay or paid contact-enrichment provider was used.",
            "NHSBSA FOI-01958 pharmacy mailbox data is current as of 2024-06-03 and should be cross-matched to current active premises.",
            "Do not assume a constructed email is verified unless a source explicitly provides it.",
            "Scotland/Wales/Northern Ireland sources may not publish a branch email for every premise.",
        ],
        "files": manifest,
    }
    (OUT / "manifest.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(json.dumps(metadata, indent=2))

    hard_errors = [m for m in manifest if m.get("error") and m.get("name") in {"ods_edispensary_current.csv", "england_nhs_shared_mailboxes_foi01958_20240603.csv", "scotland_dispenser_contactdetails_202604.csv"}]
    if hard_errors:
        print("Hard source failures:", hard_errors, file=sys.stderr)
        raise SystemExit(2)


if __name__ == "__main__":
    main()
