import sys
import requests
import json

class BeerAPI(object):

    """Docstring for BeerAPI. """

    def __init__(self, api="https://api.punkapi.com/v2/", endpoint="beers"):
        self.api = api
        self.endpoint = endpoint
        self.response = ""

    def getBeerList(self, minABV, maxABV):
        """Gets the beer list from the Punk API according to
        min_ABV and max_ABV

        :min_ABV: minimum ABV value of the beer
        :min_ABV: maximum ABV value of the beer
        :returns: beer list json object
        """
        payload = {'abv_gt': minABV, 'abv_lt': maxABV}
        response = requests.get(self.api + self.endpoint, params=payload)
        if not response.ok:
            print("ERROR: request failed")
            sys.exit(1)
        response = response.json()
        #  response = json.load(open('./beers'))
        response = json.dumps(response, sort_keys=True, indent=2)
        self.response = json.loads(response)

    def printBeerList(self):
        for response in self.response:
            hops = ""
            malts = ""
            print("name: ", response["name"])
            print("image url: ", response["image_url"])
            print("description: ", response["description"])
            print("tagline: ", response["tagline"])
            for hop in response["ingredients"]["hops"]:
                hops += ", "  + hop["name"]
            for malt in response["ingredients"]["malt"]:
                malts += ", " + malt["name"]
            print("hops: ", hops[1:])
            print("malts: ", malts[1:])
            print()


if __name__ == '__main__':
    try:
        min_ABV = float(sys.argv[1])
        max_ABV = float(sys.argv[2])
    except:
        print("USAGE: beerGenerator.py min_ABV(number) max_ABV(number)")
        sys.exit(1)

    beers = BeerAPI()
    beers.getBeerList(min_ABV, max_ABV)
    beers.printBeerList()
