#!/usr/bin/env python3
"""Generate a consolidated financial dataset for the budget web app."""
from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

TRANSACTION_FILES = [
    (BASE_DIR / "1095801S1_04Z87L1V.CSV", "1095801S1"),
    (BASE_DIR / "9351515S1_04Z87L70.CSV", "9351515S1"),
]

BUDGET_FILE = BASE_DIR / "budget.xlsx"

DATE_FORMAT = "%d %b %Y"


@dataclass
class Transaction:
    date: datetime
    description: str
    amount: float
    balance: float | None
    account: str
    category: str = "Uncategorized"
    subcategory: str = "Other"
    type: str = "expense"  # income | expense | transfer
    property: str | None = None  # Home | Airbnb | None

    def to_dict(self) -> dict:
        return {
            "date": self.date.strftime("%Y-%m-%d"),
            "description": self.description,
            "amount": round(self.amount, 2),
            "balance": round(self.balance, 2) if self.balance is not None else None,
            "account": self.account,
            "category": self.category,
            "subcategory": self.subcategory,
            "type": self.type,
            "property": self.property,
        }


def load_shared_strings(zip_path: Path) -> list[str]:
    with zipfile.ZipFile(zip_path) as zf:
        xml_bytes = zf.read("xl/sharedStrings.xml")
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    root = ET.fromstring(xml_bytes)
    strings: list[str] = []
    for si in root.findall("a:si", ns):
        text_fragments = [node.text for node in si.findall(".//a:t", ns) if node.text]
        strings.append("".join(text_fragments))
    return strings


def load_sheet(zip_path: Path, sheet_name: str, shared_strings: list[str]) -> list[list[str]]:
    with zipfile.ZipFile(zip_path) as zf:
        xml_bytes = zf.read(sheet_name)
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    root = ET.fromstring(xml_bytes)
    data: list[list[str]] = []
    for row in root.findall(".//a:sheetData/a:row", ns):
        row_values: list[str] = []
        for cell in row.findall("a:c", ns):
            value_node = cell.find("a:v", ns)
            if value_node is None:
                row_values.append("")
                continue
            if cell.attrib.get("t") == "s":
                row_values.append(shared_strings[int(value_node.text)])
            else:
                row_values.append(value_node.text)
        if any(value.strip() for value in row_values):
            data.append(row_values)
    return data


def load_budget_items() -> list[dict]:
    if not BUDGET_FILE.exists():
        return []
    shared_strings = load_shared_strings(BUDGET_FILE)
    rows = load_sheet(BUDGET_FILE, "xl/worksheets/sheet1.xml", shared_strings)
    items: list[dict] = []
    current_group: str | None = None
    for row in rows[1:]:  # skip header row
        name = row[0].strip() if len(row) > 0 else ""
        if not name:
            continue
        annual = float(row[1]) if len(row) > 1 and row[1] else None
        fortnight = float(row[2]) if len(row) > 2 and row[2] else None
        notes = row[3].strip() if len(row) > 3 else ""
        if annual is None and fortnight is None:
            current_group = name
            continue
        items.append(
            {
                "group": current_group or "Miscellaneous",
                "item": name,
                "annual_budget": annual,
                "fortnight_budget": fortnight,
                "notes": notes,
            }
        )
    return items


def parse_date(value: str) -> datetime:
    value = value.strip()
    for candidate in (value, value.split(",")[0]):
        candidate = candidate.strip()
        if not candidate:
            continue
        try:
            return datetime.strptime(candidate, DATE_FORMAT)
        except ValueError:
            continue
    raise ValueError(f"Unrecognised date format: {value!r}")


def clean_description(text: str) -> str:
    text = text.strip().strip('"')
    if "BPAY:" in text:
        text = text.split("BPAY:", 1)[1].strip()
    if " From:" in text:
        text = text.split(" From:", 1)[0].strip()
    if "ONLINE" in text and "TFR" in text:
        text = text.split("ONLINE", 1)[0].strip()
    text = re.sub(r"\s+", " ", text)
    return text


def normalise_description(text: str) -> str:
    """Human readable merchant name."""
    simplified = clean_description(text)
    return simplified.title()


TRANSFER_ACCOUNT_PATTERNS = (
    "9351515S2",
    "9351515S3",
    "9351515L84",
    "9351515S1",
    "226185S1",
    "9351515L70",
)


FUEL_KEYWORDS = (
    "BP ",
    "CAL",  # Caltex variations (CALD/Caltex)
    "CALTEX",
    "AMPOL",
    "SHELL",
    "MOBIL",
    "GULF",
    "UNITED",
    "LIBERTY",
)

GROCERY_KEYWORDS = (
    "WOOLWORTHS",
    "WOOLWORTHS ONLINE",
    "COLES",
    "ESTELLA FOODWORKS",
    "IGA",
    "RITCHIES",
    "ALDI",
    "FOODWORKS",
)

DINING_KEYWORDS = (
    "HOTEL",
    "CAFE",
    "MCDONALD",
    "KFC",
    "SUBWAY",
    "BISTRO",
    "CLUB",
    "PUB",
    "PIZZA",
    "RESTAURANT",
    "CANTEEN",
    "BAKERY",
)

RETAIL_KEYWORDS = (
    "KMART",
    "BIG W",
    "MYER",
    "JB HI",
    "TARGET",
    "BWS",
    "DAN MURPHY",
    "SUPER CHEAP",
    "SUPERCHEAP",
    "BUNNINGS",
    "AMAZON",
    "OFFICEWORKS",
    "HARVEY NORMAN",
    "PLATYPUS",
    "KATHMANDU",
    "ANACONDA",
    "DECJUBA",
)

SUBSCRIPTION_KEYWORDS = (
    "PAYPAL AUSTRALIA",
    "STAN.COM.AU",
    "NETFLIX",
    "SPOTIFY",
    "OPENAI *CHATGPT",
    "MICROSOFT",
    "APPLE.COM/BILL",
    "GOOGLE *",
    "AMZNPRIME",
)


ESSENTIAL_SUBCATEGORIES = {
    "Water - Home",
    "Electricity - Home",
    "Telecom - Home",
    "Rates - Home",
    "Insurance - Home",
    "Income Protection",
    "Health Insurance",
    "Healthcare",
    "Pharmacy",
    "Groceries",
    "Butcher",
    "Fuel",
    "Vehicle Costs",
    "Education Fees",
    "Airbnb Loan Payment",
    "Airbnb Utilities",
    "Airbnb Rates",
    "Airbnb Cleaning",
    "Airbnb Maintenance",
}


def is_transfer_description(text: str) -> bool:
    text_upper = text.upper()
    return any(pattern in text_upper for pattern in TRANSFER_ACCOUNT_PATTERNS)


def classify_transaction(tx: Transaction) -> None:
    text = tx.description.upper()
    amount = tx.amount
    # Default type based on sign
    if amount > 0:
        tx.type = "income"
    elif amount < 0:
        tx.type = "expense"
    else:
        tx.type = "neutral"

    # Transfers between owned accounts
    if "TFR" in text and is_transfer_description(text):
        tx.category = "Transfers"
        if "9351515L84" in text:
            if amount < 0:
                tx.category = "Airbnb Property"
                tx.subcategory = "Airbnb Loan Payment"
                tx.type = "expense"
                tx.property = "Airbnb"
            else:
                tx.category = "Airbnb Property"
                tx.subcategory = "Airbnb Loan Redraw"
                tx.type = "income"
                tx.property = "Airbnb"
        elif "9351515S2" in text:
            tx.subcategory = "Vehicle Sinking Fund"
            tx.type = "transfer"
        elif "9351515S3" in text:
            tx.subcategory = "Family Sinking Fund"
            tx.type = "transfer"
        elif "9351515S1" in text or "226185S1" in text:
            tx.subcategory = "Partner Transfer"
            tx.type = "transfer"
        else:
            tx.subcategory = "Internal Transfer"
            tx.type = "transfer"
        return

    if "POS W/D" in text or "ATM" in text:
        tx.category = "Cash & Card"
        tx.subcategory = "Cash Withdrawal"
        tx.type = "expense"
        return

    if text.startswith("INTEREST DEBIT") or "ATM OPERATOR FEE" in text:
        tx.category = "Financial"
        tx.subcategory = "Bank Charges"
        tx.type = "expense"
        return

    if text.startswith("INTEREST CREDIT"):
        tx.category = "Financial"
        tx.subcategory = "Interest Earned"
        tx.type = "income"
        return

    if "DIRECT CREDIT" in text and "ATO" in text:
        tx.category = "Income"
        tx.subcategory = "Tax Refund"
        tx.type = "income"
        return

    if "NSW GOVT SCHOOLS PAYRO" in text or "CHARLES STURT UNIVERSI" in text:
        tx.category = "Income"
        tx.subcategory = "Salary"
        tx.type = "income"
        return

    if "DOBRIM PTY LTD" in text or "AIRBNB" in text:
        tx.category = "Income"
        tx.subcategory = "Airbnb Income"
        tx.property = "Airbnb"
        tx.type = "income"
        return

    if "MCARE BENEFITS" in text or "TEACHERS HEALTH" in text and tx.amount > 0:
        tx.category = "Income"
        tx.subcategory = "Health Rebates"
        tx.type = "income"
        return

    if "STRIPE" in text:
        tx.category = "Income"
        tx.subcategory = "Other Income"
        tx.type = "income"
        return

    if text.startswith("TFR FROM") and "COWELL" in text:
        tx.category = "Income"
        tx.subcategory = "Partner Transfer"
        tx.type = "income"
        return

    if "PAYROLL" in text and tx.amount > 0:
        tx.category = "Income"
        tx.subcategory = "Salary"
        tx.type = "income"
        return

    if "AIDF" in text and "TRAC" in text:
        tx.category = "Kids & Education"
        if "REFUND" in text and amount > 0:
            tx.subcategory = "School Fee Refund"
            tx.type = "income"
        else:
            tx.subcategory = "Education Fees"
            tx.type = "expense"
        return

    if "TF REF:NSWTEACHERS FED" in text:
        tx.category = "Professional"
        tx.subcategory = "Union Fees"
        tx.type = "expense"
        return

    if "SMITHS CLEANING" in text:
        tx.category = "Airbnb Property"
        tx.subcategory = "Airbnb Cleaning"
        tx.type = "expense"
        tx.property = "Airbnb"
        return

    if "SFR PEST CONTROL" in text or "PEST" in text:
        tx.category = "Airbnb Property"
        tx.subcategory = "Airbnb Maintenance"
        tx.type = "expense"
        tx.property = "Airbnb"
        return

    if "MOIRA SHIRE" in text or "MOIRA" in text and "RATES" in text:
        tx.category = "Airbnb Property"
        tx.subcategory = "Airbnb Rates"
        tx.type = "expense"
        tx.property = "Airbnb"
        return

    if "NORTH EAST WATER" in text:
        tx.category = "Airbnb Property"
        tx.subcategory = "Airbnb Utilities"
        tx.type = "expense"
        tx.property = "Airbnb"
        return

    if "AUSSIE BROADBAND" in text:
        tx.category = "Airbnb Property"
        tx.subcategory = "Airbnb Utilities"
        tx.type = "expense"
        tx.property = "Airbnb"
        return

    if "ORIGIN ENERGY" in text:
        # Home autopay amounts are $140 and $80
        if abs(amount) in {140.0, 80.0}:
            tx.category = "Housing & Utilities"
            tx.subcategory = "Electricity - Home"
            tx.type = "expense"
            tx.property = "Home"
        else:
            tx.category = "Airbnb Property"
            tx.subcategory = "Airbnb Utilities"
            tx.type = "expense"
            tx.property = "Airbnb"
        return

    if "WWCC RATES" in text or "WAGGA WAGGA CITY COUNCIL" in text:
        tx.category = "Housing & Utilities"
        tx.subcategory = "Rates - Home"
        tx.type = "expense"
        tx.property = "Home"
        return

    if "RIVERINA WATER" in text:
        tx.category = "Housing & Utilities"
        tx.subcategory = "Water - Home"
        tx.type = "expense"
        tx.property = "Home"
        return

    if "TELSTRA" in text:
        tx.category = "Housing & Utilities"
        tx.subcategory = "Telecom - Home"
        tx.type = "expense"
        tx.property = "Home"
        return

    if "WFI" in text:
        tx.category = "Health & Insurance"
        tx.subcategory = "Insurance - Home"
        tx.type = "expense"
        return

    if "BT LIFE" in text or "TAL LIFE" in text or "BT LIFE INSURANC" in text:
        tx.category = "Health & Insurance"
        tx.subcategory = "Income Protection"
        tx.type = "expense"
        return

    if "TEACHERS HEALTH" in text and amount < 0:
        tx.category = "Health & Insurance"
        tx.subcategory = "Health Insurance"
        tx.type = "expense"
        return

    if "CWH" in text or "CHEMIST" in text:
        tx.category = "Health & Insurance"
        tx.subcategory = "Pharmacy"
        tx.type = "expense"
        return

    if any(keyword in text for keyword in FUEL_KEYWORDS):
        tx.category = "Transportation"
        tx.subcategory = "Fuel"
        tx.type = "expense"
        return

    if "NRMA" in text:
        tx.category = "Transportation"
        tx.subcategory = "Vehicle Costs"
        tx.type = "expense"
        return

    if "YAMAHA" in text:
        tx.category = "Entertainment & Recreation"
        tx.subcategory = "Boat & Recreation"
        tx.type = "expense"
        return

    if "BUNNINGS" in text:
        tx.category = "Home & Garden"
        tx.subcategory = "Home Improvement"
        tx.type = "expense"
        return

    if any(keyword in text for keyword in GROCERY_KEYWORDS):
        tx.category = "Groceries & Dining"
        tx.subcategory = "Groceries"
        tx.type = "expense"
        return

    if "BUTCH" in text:
        tx.category = "Groceries & Dining"
        tx.subcategory = "Butcher"
        tx.type = "expense"
        return

    if any(keyword in text for keyword in DINING_KEYWORDS):
        tx.category = "Groceries & Dining"
        tx.subcategory = "Dining & Takeaway"
        tx.type = "expense"
        return

    if any(keyword in text for keyword in RETAIL_KEYWORDS):
        tx.category = "Lifestyle & Shopping"
        tx.subcategory = "Retail"
        tx.type = "expense"
        return

    if any(keyword in text for keyword in SUBSCRIPTION_KEYWORDS):
        tx.category = "Lifestyle & Shopping"
        tx.subcategory = "Subscriptions"
        if amount > 0:
            tx.type = "income"
        else:
            tx.type = "expense"
        return

    if "Ballet" in text or "SPORT" in text and "CLUB" not in text:
        tx.category = "Entertainment & Recreation"
        tx.subcategory = "Kids Activities"
        tx.type = "expense"
        return

    if "LOAN" in text and amount < 0:
        tx.category = "Financial"
        tx.subcategory = "Loan Payment"
        tx.type = "expense"
        return

    if text.startswith("DIRECT DEBIT") and "BT" in text:
        tx.category = "Health & Insurance"
        tx.subcategory = "Income Protection"
        tx.type = "expense"
        return

    if text.startswith("DIRECT DEBIT"):
        tx.category = "Financial"
        tx.subcategory = "Direct Debit"
        if amount < 0:
            tx.type = "expense"
        else:
            tx.type = "income"
        return

    # Default fallback
    tx.category = "Uncategorized"
    tx.subcategory = "Other"
    if amount > 0:
        tx.type = "income"
    elif amount < 0:
        tx.type = "expense"
    else:
        tx.type = "neutral"


def read_transactions() -> list[Transaction]:
    transactions: list[Transaction] = []
    for file_path, account_name in TRANSACTION_FILES:
        if not file_path.exists():
            continue
        with file_path.open(newline="") as handle:
            reader = csv.reader(handle)
            header = next(reader, None)
            account_identifier = header[0] if header else account_name
            for row in reader:
                if not row or not row[0].strip():
                    continue
                date_value = parse_date(row[0])
                description = row[2].strip()
                amount_value = float(row[4]) if len(row) > 4 and row[4] else 0.0
                balance_value = float(row[5]) if len(row) > 5 and row[5] else None
                tx = Transaction(
                    date=date_value,
                    description=description,
                    amount=amount_value,
                    balance=balance_value,
                    account=account_identifier,
                )
                classify_transaction(tx)
                transactions.append(tx)
    transactions.sort(key=lambda t: t.date)
    return transactions


def aggregate(transactions: list[Transaction]) -> dict:
    category_totals: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    subcategory_totals: dict[tuple[str, str], dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    property_totals: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})
    merchant_expenses: Counter[str] = Counter()
    merchant_incomes: Counter[str] = Counter()
    monthly: dict[str, dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})

    total_income = 0.0
    total_expense = 0.0

    for tx in transactions:
        category_totals[tx.category]  # ensure key exists
        subcategory_totals[(tx.category, tx.subcategory)]

        if tx.type == "income" and tx.amount > 0:
            value = tx.amount
            total_income += value
            category_totals[tx.category]["income"] += value
            subcategory_totals[(tx.category, tx.subcategory)]["income"] += value
            if tx.property:
                property_totals[tx.property]["income"] += value
            merchant_incomes[normalise_description(tx.description)] += value
            month_key = tx.date.strftime("%Y-%m")
            monthly[month_key]["income"] += value
        elif tx.type == "expense" and tx.amount < 0:
            value = -tx.amount
            total_expense += value
            category_totals[tx.category]["expense"] += value
            subcategory_totals[(tx.category, tx.subcategory)]["expense"] += value
            if tx.property:
                property_totals[tx.property]["expense"] += value
            merchant_expenses[normalise_description(tx.description)] += value
            month_key = tx.date.strftime("%Y-%m")
            monthly[month_key]["expenses"] += value
        elif tx.type == "transfer":
            # Transfers excluded from income/expense tallies but recorded in monthly flow for awareness
            month_key = tx.date.strftime("%Y-%m")
            monthly[month_key].setdefault("transfers", 0.0)
            monthly[month_key]["transfers"] += tx.amount

    return {
        "category_totals": category_totals,
        "subcategory_totals": subcategory_totals,
        "property_totals": property_totals,
        "merchant_expenses": merchant_expenses,
        "merchant_incomes": merchant_incomes,
        "monthly": monthly,
        "total_income": total_income,
        "total_expense": total_expense,
    }


def summarise_airbnb(transactions: list[Transaction]) -> dict:
    income = 0.0
    expenses = 0.0
    utilities = defaultdict(float)
    cleaning = 0.0
    maintenance = 0.0
    loan_payments = 0.0
    loan_redraws = 0.0

    for tx in transactions:
        if tx.property != "Airbnb":
            continue
        if tx.type == "income" and tx.amount > 0:
            income += tx.amount
            if tx.subcategory == "Airbnb Loan Redraw":
                loan_redraws += tx.amount
        elif tx.type == "expense" and tx.amount < 0:
            expenses += -tx.amount
            if tx.subcategory == "Airbnb Utilities":
                utilities[tx.description.upper()] += -tx.amount
            elif tx.subcategory == "Airbnb Cleaning":
                cleaning += -tx.amount
            elif tx.subcategory == "Airbnb Maintenance":
                maintenance += -tx.amount
            elif tx.subcategory == "Airbnb Loan Payment":
                loan_payments += -tx.amount
            elif tx.subcategory == "Airbnb Rates":
                utilities["RATES"] += -tx.amount
        # Rates categorised separately above in aggregator; ensure they appear in utilities summary
        if tx.category == "Airbnb Property" and tx.subcategory == "Airbnb Rates" and tx.amount < 0:
            utilities["RATES"] += -tx.amount

    # Re-map utilities to friendly labels
    friendly_utilities = defaultdict(float)
    for key, value in utilities.items():
        label = "Utilities"
        if "AUSSIE BROADBAND" in key:
            label = "Internet"
        elif "ORIGIN" in key:
            label = "Electricity"
        elif "NORTH EAST WATER" in key:
            label = "Water"
        elif "RATES" in key or "MOIRA" in key:
            label = "Rates"
        friendly_utilities[label] += value

    return {
        "income": income,
        "expenses": expenses,
        "net": income - expenses,
        "utilities": dict(sorted(friendly_utilities.items())),
        "cleaning": cleaning,
        "maintenance": maintenance,
        "loan_payments": loan_payments,
        "loan_redraws": loan_redraws,
    }


def compute_budget_progress(budget_items: list[dict], aggregates: dict) -> list[dict]:
    actuals = aggregates["subcategory_totals"]
    summary: list[dict] = []
    for item in budget_items:
        key = ("Groceries & Dining", "Groceries") if item["item"] == "Groceries" else None
        mapping = {
            "Water": ("Housing & Utilities", "Water - Home"),
            "Gas/Electricity": ("Housing & Utilities", "Electricity - Home"),
            "Internet/Phone/Pay TV": ("Housing & Utilities", "Telecom - Home"),
            "Rates": ("Housing & Utilities", "Rates - Home"),
            "Groceries": ("Groceries & Dining", "Groceries"),
            "Butchers": ("Groceries & Dining", "Butcher"),
            "Restaurants": ("Groceries & Dining", "Dining & Takeaway"),
            "Fuel": ("Transportation", "Fuel"),
            "Tuscon Car/Anne": ("Transportation", "Vehicle Costs"),
            "Colorado Ute/Steve": ("Transportation", "Vehicle Costs"),
            "Mazda Ute/James": ("Transportation", "Vehicle Costs"),
            "Honda Car/Lily": ("Transportation", "Vehicle Costs"),
            "BT Life Insurance": ("Health & Insurance", "Income Protection"),
            "Healthcare": ("Health & Insurance", "Healthcare"),
            "Pharmacy": ("Health & Insurance", "Pharmacy"),
            "House and Content - WFI": ("Health & Insurance", "Insurance - Home"),
            "Doctors/Dentist/Physio": ("Health & Insurance", "Healthcare"),
            "Ballet/Sport": ("Entertainment & Recreation", "Kids Activities"),
        }
        if item["item"] not in mapping:
            actual_value = None
        else:
            key = mapping[item["item"]]
            actual_value = actuals.get(key, {"expense": 0.0, "income": 0.0})["expense"]
        budget_value = item["annual_budget"] or 0.0
        variance = None
        if actual_value is not None and budget_value:
            variance = actual_value - budget_value
        summary.append(
            {
                "group": item["group"],
                "item": item["item"],
                "annual_budget": budget_value,
                "actual": actual_value,
                "variance": variance,
                "notes": item["notes"],
            }
        )
    return summary


def essential_spending(aggregates: dict) -> dict:
    sub_totals = aggregates["subcategory_totals"]
    essential_total = 0.0
    for (category, subcategory), values in sub_totals.items():
        if subcategory in ESSENTIAL_SUBCATEGORIES:
            essential_total += values["expense"]
    total_income = aggregates["total_income"]
    total_expense = aggregates["total_expense"]
    discretionary = max(total_expense - essential_total, 0.0)
    return {
        "annual_essential": essential_total,
        "annual_discretionary": discretionary,
        "annual_income": total_income,
    }


def calculate_tax_data(transactions: list[Transaction]) -> dict:
    """Calculate tax-related information from transactions for Australian financial year."""
    # Current financial year (July 1 - June 30)
    now = datetime.now()
    if now.month >= 7:
        fy_start = datetime(now.year, 7, 1)
        fy_end = datetime(now.year + 1, 6, 30)
        fy_label = f"{now.year}-{str(now.year + 1)[-2:]}"
    else:
        fy_start = datetime(now.year - 1, 7, 1)
        fy_end = datetime(now.year, 6, 30)
        fy_label = f"{now.year - 1}-{str(now.year)[-2:]}"
    
    fy_transactions = [tx for tx in transactions if fy_start <= tx.date <= fy_end]
    
    # Calculate income categories
    salary_income = sum(tx.amount for tx in fy_transactions 
                       if tx.type == "income" and tx.subcategory == "Salary")
    
    airbnb_income = sum(tx.amount for tx in fy_transactions 
                       if tx.type == "income" and tx.subcategory == "Airbnb Income")
    
    other_income = sum(tx.amount for tx in fy_transactions 
                      if tx.type == "income" and tx.subcategory not in ["Salary", "Airbnb Income"])
    
    # Calculate deductions (Airbnb expenses are tax-deductible)
    airbnb_deductions = sum(abs(tx.amount) for tx in fy_transactions 
                           if tx.type == "expense" and tx.category == "Airbnb Property")
    
    total_income = salary_income + airbnb_income + other_income
    taxable_income = total_income - airbnb_deductions
    
    return {
        "financial_year": fy_label,
        "salary_income": round(salary_income, 2),
        "airbnb_income": round(airbnb_income, 2),
        "other_income": round(other_income, 2),
        "total_income": round(total_income, 2),
        "airbnb_deductions": round(airbnb_deductions, 2),
        "taxable_income": round(taxable_income, 2),
    }


def build_output(transactions: list[Transaction]) -> dict:
    aggregates = aggregate(transactions)
    budget_items = load_budget_items()
    budget_summary = compute_budget_progress(budget_items, aggregates)
    airbnb_summary = summarise_airbnb(transactions)
    essential_summary = essential_spending(aggregates)
    tax_data = calculate_tax_data(transactions)

    monthly_rows = []
    for month, values in sorted(aggregates["monthly"].items()):
        net = values["income"] - values["expenses"]
        monthly_rows.append(
            {
                "month": month,
                "income": round(values["income"], 2),
                "expenses": round(values["expenses"], 2),
                "net": round(net, 2),
            }
        )

    category_rows = []
    for category, values in sorted(aggregates["category_totals"].items()):
        net = values["income"] - values["expense"]
        category_rows.append(
            {
                "category": category,
                "income": round(values["income"], 2),
                "expense": round(values["expense"], 2),
                "net": round(net, 2),
            }
        )

    subcategory_rows = []
    for (category, subcategory), values in sorted(aggregates["subcategory_totals"].items()):
        net = values["income"] - values["expense"]
        subcategory_rows.append(
            {
                "category": category,
                "subcategory": subcategory,
                "income": round(values["income"], 2),
                "expense": round(values["expense"], 2),
                "net": round(net, 2),
            }
        )

    merchant_spend = [
        {"merchant": name, "total": round(amount, 2)}
        for name, amount in aggregates["merchant_expenses"].most_common(20)
    ]
    merchant_income = [
        {"merchant": name, "total": round(amount, 2)}
        for name, amount in aggregates["merchant_incomes"].most_common(20)
    ]

    total_income = aggregates["total_income"]
    total_expense = aggregates["total_expense"]
    net_position = total_income - total_expense
    savings_rate = (net_position / total_income * 100) if total_income else 0.0

    essential_annual = essential_summary["annual_essential"]
    discretionary_annual = essential_summary["annual_discretionary"]
    average_monthly_net = net_position / max(len(monthly_rows), 1)

    metrics = {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_position": round(net_position, 2),
        "savings_rate": round(savings_rate, 2),
        "average_monthly_net": round(average_monthly_net, 2),
        "essential_annual": round(essential_annual, 2),
        "discretionary_annual": round(discretionary_annual, 2),
    }

    calc_defaults = {
        "fortnightly_income": 6922.0,
        "essential_fortnight": round(essential_annual / 26, 2) if essential_annual else None,
        "discretionary_fortnight": round(discretionary_annual / 26, 2) if discretionary_annual else None,
        "monthly_surplus": round(average_monthly_net, 2),
        "airbnb_income": round(airbnb_summary["income"], 2),
        "airbnb_expense": round(airbnb_summary["expenses"], 2),
    }

    # Include all transactions from the last 12 months (or all if less than 12 months of data)
    # Calculate 12 months ago from the most recent transaction
    if transactions:
        most_recent_date = transactions[-1].date
        twelve_months_ago = datetime(most_recent_date.year - 1, most_recent_date.month, most_recent_date.day)
        # Filter transactions from last 12 months
        recent_transactions = [tx.to_dict() for tx in transactions if tx.date >= twelve_months_ago]
    else:
        recent_transactions = []

    return {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "metrics": metrics,
        "category_summary": category_rows,
        "subcategory_summary": subcategory_rows,
        "monthly_cashflow": monthly_rows,
        "budget_summary": budget_summary,
        "airbnb_summary": airbnb_summary,
        "tax_data": tax_data,
        "top_merchants": merchant_spend,
        "top_income_sources": merchant_income,
        "recent_transactions": recent_transactions,
        "calc_defaults": calc_defaults,
    }


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    transactions = read_transactions()
    payload = build_output(transactions)
    output_path = DATA_DIR / "financial_overview.json"
    output_path.write_text(json.dumps(payload, indent=2))
    print(f"Wrote {output_path.relative_to(BASE_DIR)}")


if __name__ == "__main__":
    main()
