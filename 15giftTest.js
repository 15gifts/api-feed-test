/************************
- 15gifts.com
- 
*************************/

const request = require("request");
const jsonfile = require("jsonfile");

const getPunk = async (abvGt, abvLt) => {
  const url = `https://api.punkapi.com/v2/beers?abv_gt=${abvGt}&abv_lt=${abvLt}`;

  request({ url: url }, (error, response) => {
    const data = JSON.parse(response.body);

    const outputPunk = [];

    for (let i = 0; i <= data.length; i++) {
      if (data[i]) {
        const allmalt = data[i].ingredients.malt;
        let malt = "";

        const allHops = data[i].ingredients.hops;
        let hops = "";

        allmalt.forEach((e) => {
          malt += e.name + ",";
        });

        allHops.forEach((e) => {
          hops += e.name + ",";
        });
        // const allmalts = malt.join(",");

        outputPunk.push({
          name: data[i].name,
          description: data[i].description,
          imageUrl: data[i].image_url,
          tagline: data[i].tagline,
          malt: malt,
          hops: hops,
        });
      }
    }
    console.log(JSON.stringify(outputPunk));
    jsonfile.writeFile("outputPunk.json", outputPunk);
  });
};

getPunk(3, 7);
