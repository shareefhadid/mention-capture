import pymongo
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import requests
import urllib
import os
from os.path import join, dirname
import html
import re
import sys
from bson import ObjectId
from datetime import datetime, timezone

print("Starting Palliatrack ... ")

# Gets an array of command line arguments passed in from the javascript file executing this program and stores them as an array. This only works when passed a simple (not nested) array. The ternary statement is just in case we don't pass any arguments.

search_ids = sys.argv[1].split(',')

# Load dotenv
dotenv_path = join(dirname(__file__), '../../env')
load_dotenv(dotenv_path)

# Connect to DB
print("Connecting to Database ... ")

# DB URI for our Docker Container
myclient = pymongo.MongoClient(
    f'mongodb://{os.environ.get("DB_USER")}:{os.environ.get("DB_PASSWORD")}@{os.environ.get("DB_HOST")}/?authSource=admin')

# DB URI for our local set up
# myclient = pymongo.MongoClient(
#     "mongodb://localhost:27017/palliatrack_db")

# Connects to the DB and the collections that we require. Sets up the time until results expire, currently set to 90 days.
mydb = myclient["palliatrack_db"]
results_collection = mydb["results_collection"]
search_collection = mydb["search_collection"]
results_collection.create_index("createdAt", expireAfterSeconds=60*60*24*90)

print("Database Connected!")

# Creates an array of searches by finding the searches that match the _ids passed in search_ids. If search_ids does not contain search_ids, all searches are pulled.

if len(search_ids[0]) > 0:
    search_ids = [ObjectId(x) for x in search_ids]
    searches = search_collection.find({"_id": {"$in": search_ids}})
else:
    searches = search_collection.find({})


def xml_preprocess(xml_string):
    processed_string = re.sub(
        '<.*?>', '', html.unescape(xml_string).strip().replace('\n', '. '))
    return processed_string


def generate_excerpt(description_text):
    processed_excerpt = xml_preprocess(description_text)
    list_of_words = " ".join(processed_excerpt.strip().split(" ")[0:40])
    excerpt = list_of_words + "..."
    return excerpt


def generate_results_list(item, source_base_url, source_name, source_url, terms_found=set()):
    try:
        if 'http' in item.link.text:
            return {'result_source': source_name, 'result_source_url': source_url, 'result_title': xml_preprocess(item.title.text), 'result_url': item.link.text, 'result_date': xml_preprocess(item.pubDate.text), 'result_excerpt': generate_excerpt(item.description.text), 'terms_found': list(terms_found)}
        else:
            source_relative_path = item.link.text if item.link.text[
                0] == "/" else f'/{item.link.text}'
            complete_url = f'{source_base_url}{source_relative_path}'
            return {'result_source': source_name, 'result_source_url': source_url, 'result_title': xml_preprocess(item.title.text), 'result_url': complete_url, 'result_date': xml_preprocess(item.pubDate.text), 'result_excerpt': generate_excerpt(item.description.text), 'terms_found': list(terms_found)}
    except:
        print("Error Found!")


def scraper():
    print("Starting Scraper ... ")
    all_search_results = []
    for search in searches:
        search_id = str(search["_id"])
        # Initialize the object that we are going to store in our database later. We will later populate the results and the terms_found.
        # search_details = {"search_id": search_id, "createdAt": datetime.now(timezone.utc)}
        bad_urls = []
        search_terms = search["search_terms"]

        # Creates a list of existing urls from our prior results, so that we don't add duplicates later on
        prior_results = []
        temporary_query_list = results_collection.find(
            {"search_id": str(search["_id"])}, {"result_url": 1, "_id": 0})
        for prior_results_dictionary in temporary_query_list:
            prior_results.append(prior_results_dictionary["result_url"])

        # Loops through the sources in each search. Scrapes the url if the response is 200.
        for source in search["sources"]:
            source_url = source["source_url"]
            source_name = source["source_name"]

            # SET REQUEST HEADERS
            headers_dict = {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0"}

            try:
                res = requests.get(
                    source_url, headers=headers_dict, timeout=10)
            except:
                bad_urls.append(
                    f"Error: {source_url} was likely misspelled or timed out")
                continue
            if res.status_code == 200:
                if ('<rss' not in res.text) and ('<feed' not in res.text):
                    bad_urls.append(f"{source_url} is not an RSS feed")
                    continue

                print("-> Received response. ")
                soup = BeautifulSoup(res.content, features="xml")
                print("-> XML Parsed. ")
                parsed_url = urllib.parse.urlparse(source_url)
                source_base_url = f'{parsed_url[0]}://{parsed_url[1]}'
                item_list = soup.findAll('item')

                # Loop through the articles (contained in "item" tags in xml) on the source_url
                for item in item_list:
                    search_result = {"search_id": search_id,
                                      "createdAt": datetime.now(timezone.utc)}
                    # Checks if any of these tags are missing from RSS, breaks loop, appends bad_url

                    try:
                        item.description.text
                        item.title.text
                        item.link.text
                        item.pubDate.text
                    except:
                        bad_urls.append(
                            f"Error: {source_url} contains missing elements (description, title, pubDate, or link)")
                        break

                    # Only runs if URL is not already in DB
                    if item.link.text not in prior_results:
                        # Check if the search includes search terms. If it does, only append results that contain the term in the title or description, and create a list of the terms that were found. This is case-insensitive.
                        if search_terms:
                            terms_found = set()
                            if any(re.search(rf"\b{term}\b", item.title.text.casefold()) or re.search(rf"\b{term}\b", item.description.text.casefold()) for term in search_terms):
                                for term in search_terms:
                                    if re.search(rf"\b{term}\b", item.title.text.casefold()) or re.search(rf"\b{term}\b", item.description.text.casefold()):
                                        terms_found.add(term)
                                search_result.update(
                                    generate_results_list(item=item, source_base_url=source_base_url, source_name=source_name, source_url=source_url, terms_found=terms_found))
                        # If the search does not contain search terms, simply add all the results found on the page
                        else:
                            search_result.update(
                                generate_results_list(item=item, source_base_url=source_base_url, source_name=source_name, source_url=source_url))

                        # Insert result in result collection. Add to list of all results
                        if "result_url" in search_result:
                            all_search_results.append(search_result)
                            results_collection.insert_one(search_result)

            elif res.status_code:
                # If the page we are trying to scrape contains a non-200 response
                bad_urls.append(f"Error {res.status_code}: {source_url}")
                continue
            else:
                # If the page we are trying to scrape contains no status code
                bad_urls.append(f"Response timed out: {source_url}")
                continue

        # Updates search with bad_urls, sets it to empty array if none were found
        search_collection.find_one_and_update({"_id": search["_id"]}, {
            "$set": {"bad_urls": bad_urls}})

    print("Search Complete!")

    return all_search_results


results = scraper()
