import requests
import urllib3
from clients.supabase_client import SUPABASE_URL, SUPABASE_KEY

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


# -----------------------------
# GET BOOKS
# -----------------------------
def get_books(filters=None, order="titulo.asc"):
    url = f"{SUPABASE_URL}/rest/v1/books?order={order}"

    if filters:
        for key, value in filters.items():
            url += f"&{key}=eq.{value}"

    response = requests.get(url, headers=HEADERS, verify=False)
    response.raise_for_status()

    return response.json()


# -----------------------------
# UPDATE BOOK
# -----------------------------
def update_book(book_id, data):
    url = f"{SUPABASE_URL}/rest/v1/books?id=eq.{book_id}"

    response = requests.patch(
        url,
        headers=HEADERS,
        json=data,
        verify=False
    )

    return response.json()


# -----------------------------
# (FUTURO) INSERT BOOK
# -----------------------------
def insert_book(data):
    url = f"{SUPABASE_URL}/rest/v1/books"

    response = requests.post(
        url,
        headers=HEADERS,
        json=data,
        verify=False
    )

    return response.json()


# -----------------------------
# (FUTURO) DELETE BOOK
# -----------------------------
def delete_book(book_id):
    url = f"{SUPABASE_URL}/rest/v1/books?id=eq.{book_id}"

    response = requests.delete(
        url,
        headers=HEADERS,
        verify=False
    )

    return response.json()