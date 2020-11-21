#!/usr/bin/env node
const axios = require("axios");

// --| Set colours name
const ConsoleColor =
{
    ResetDefault: '\x1b[0m',
    Yellow: '\x1b[33m',
    Red: '\x1b[31m',
    Blue: '\x1b[34m',
    Green: '\x1b[32m',
};

// --| ---------------------------------------------------------
// --| I also installed the following in the same folder path:
// --| npm install -g .
// --| So I can run the cli module globally using "beer"
// --| ---------------------------------------------------------

// --| If the command doesn't contain maximum 2 parameters such as min and max, exit
if(process.argv.length !== 4)
{
    console.log("🍺 Please provide the necessary parameters for ABV searching: min and max values!");
    process.exit(1);
}

// --| Get only the min and max parameters
const args = process.argv.slice(2);

// --| Show a small info of how to use the cli if there are no numbers specified as min and max
// --| We let the min to be equal to 0 if the user wants
if(isNaN(args[0]) || isNaN(args[1]) || parseFloat(args[0]) < 0 || parseFloat(args[1]) <= 0)
{
    console.log("🍺 Parameters min and max must contain a positive number value for ABV searching!");
    process.exit(1);
}

axios.get(`https://api.punkapi.com/v2/beers?abv_gt=${args[0]}&abv_lt=${args[1]}`).then((response) =>
{
    // --| If results are empty, warn the user in console
    if(response.data === undefined || response.data.length <= 0)
    {
        console.log("🍺 No results found from your search values...");
        process.exit(1);
    }

    // --| Sort by yeast and we get the array below
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

        // --| Regex in there is just to replace empty, unknown spaces and new lines from API mistakes (if any)
        // --| Added some sanitization + better reading?
        const ResponseOutput = `🍺 Beer info: (Yeast: ${ConsoleColor.Yellow}${(item.ingredients.yeast.length > 0) ? item.ingredients.yeast.trim() : "Unknown"}${ConsoleColor.ResetDefault})
                                Beer name: ${ConsoleColor.Red}${(item.name.length > 0) ? item.name.trim() : "Unknown Name"}${ConsoleColor.ResetDefault}
                                Beer image URL: ${ConsoleColor.Blue}${(item.image_url.length) > 0 ? item.image_url.trim() : "Missing URL"}${ConsoleColor.ResetDefault}
                                Beer Description: ${ConsoleColor.Green}${(item.description.length > 0) ? item.description.trim() : "Unknown Description"}${ConsoleColor.ResetDefault}
                                Beer tagline: ${ConsoleColor.Yellow}${(item.tagline.length > 0) ? item.tagline.trim() : "Unknown Tagline"}${ConsoleColor.ResetDefault}
                                Beer Hops: ${ConsoleColor.Green}${(BeerHop.length > 0) ? BeerHop.join(", ").replace(/(?:\r\n|\r|\n)/g, "") : "No hops"}${ConsoleColor.ResetDefault}
                                Beer Malts: ${ConsoleColor.Green}${(BeerMalts.length > 0) ? BeerMalts.join(", ").replace(/(?:\r\n|\r|\n)/g, "") : "No malts"}${ConsoleColor.ResetDefault}\n\n`;

        // --| Log the result and also remove spaces in template literal (but keep new line breaks) because it messes with indentation in console
        console.log(ResponseOutput.replace(/^\x20+|\x20+$/gm, ""));
    });

}).catch((err) =>
{
    console.log("🍺 Something went wrong accessing the brewery...");
    console.log(err.message);

    process.exit(1);
});
