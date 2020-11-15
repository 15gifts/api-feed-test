#!/usr/bin/env node
const axios = require("axios");

// --| ---------------------------------------------------------
// --| I also installed the following in the same folder path:
// --| npm install -g .
// --| So I can run the cli module globally using "beer"
// --| ---------------------------------------------------------

// --| If the command doesn't contain maximum 2 parameters such as min and max, exit
if (process.argv.length !== 4)
{
    console.log("🍺 Please provide the necessary parameters for ABV searching: min and max values!");
    process.exit(1);
}

// --| Get only the min and max parameters
const args = process.argv.slice(2);

// --| Show a small info of how to use the cli if there are no numbers specified as min and max
// --| We let the min to be equal to 0 if the user wants
if (isNaN(args[0]) || isNaN(args[1]) || parseFloat(args[0]) < 0 || parseFloat(args[1]) <= 0)
{
    console.log("🍺 Parameters min and max must contain a positive number value for ABV searching!");
    process.exit(1);
}

axios.get(`https://api.punkapi.com/v2/beers?abv_gt=${args[0]}&abv_lt=${args[1]}`).then((response) =>
{
    // --| If results are empty, warn the user in console
    if (response.data === undefined || response.data.length === 0)
    {
        console.log("🍺 No results found from your search values...");
        process.exit(1);
    }

    // --| Sorty yeast and we get the array below
    /*
        [
            'Champagne',
            'Saflager S189',
            'WLP099 - Super High Gravity Ale',
            'Wyeast 1056 - American Ale™',
            'Wyeast 1056 - American Ale™',
            'Wyeast 1056 - American Ale™ & Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 1272 - American Ale II™',
            'Wyeast 3333 - German Wheat™',
            'Wyeast 3522 - Belgian Ardennes™',
            'Wyeast 3522 - Belgian Ardennes™',
            'Wyeast 3522 - Belgian Ardennes™',
            'Wyeast 3711 - French Saison™',
            'Wyeast 3787 - Trappist High Gravity™'
        ]
    */

    // --| Sort by yeast and then process and log
    response.data.sort((a, b) => a.ingredients.yeast.localeCompare(b.ingredients.yeast)).forEach((item) =>
    {
        // --| Could be better? YES IT COULD, I'm doing things under pressure so I'm pretty sure there must be another way
        // --| While for this particular cli it works fast, yea, I need to find another way :3
        const BeerHop = new Array();
        const BeerMalts = new Array();

        item.ingredients.hops.forEach((hop) => { BeerHop.push(hop.name) });
        item.ingredients.malt.forEach((malt) => { BeerMalts.push(malt.name) });

        /* --| Example response:
           🍺 Beer info: (Yeast: Saflager S189)
            Beer name: AB:06
            Beer image URL: https://images.punkapi.com/v2/17.png
            Beer Description: Our sixth Abstrakt, this imperial black IPA combined dark malts with a monumental triple dry-hop, using an all-star team of some of our favourite American hops. Roasty and resinous.
            Beer tagline: Imperial Black IPA.
            Beer Hops: Hop Extract, Amarillo, Chinook, Cascade, Centennial, Columbus, Chinook, Cascade, Centennial, Columbus, Amarillo
            Beer Malts: Pale Ale, Crystal 150, Caramalt, Carafa Special Malt Type 1, Carafa Special Malt Type 3
        */

        // --| Log the result
        console.log(`🍺 Beer info: (Yeast: \x1b[33m${item.ingredients.yeast}\x1b[0m)\nBeer name: \x1b[31m${item.name}\x1b[0m\nBeer image URL: \x1b[34m${item.image_url}\x1b[0m\nBeer Description: \x1b[32m${item.description}\x1b[0m\nBeer tagline: \x1b[33m${item.tagline}\x1b[0m\nBeer Hops:\x1b[32m ${BeerHop.join(", ").replace(/(?:\r\n|\r|\n)/g, "")}\x1b[0m\nBeer Malts:\x1b[32m ${BeerMalts.join(", ").replace(/(?:\r\n|\r|\n)/g, "")}\x1b[0m \n\n`);
    });

}).catch((err) =>
{
    console.log("🍺 Something went wrong accessing the brewery...");
    console.log(err.message);

    process.exit(1);
});
