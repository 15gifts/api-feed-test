const axios = require('axios'); // used to execute HTTP requests
const args = process.argv.slice(2); // used to get all arguments starting from the third, as the first two are the paths
let min = -1; // variable min
let max = 0; // variable max
args.forEach(e=>{ // read each argument to check if it has --min or --max to parse the value to int
    if(e.includes('--min=')){
        min = e.replace('--min=', '');
    } else if(e.includes('--max=')){
        max = e.replace('--max=', '');
    }
    
});

min = parseFloat(min); // parsing to Float
max = parseFloat(max); // parsing to Float

if(min < 0){ //
    console.log('Min should be equals or greater than 0.');
    return;
} else if(isNaN(min)){
    console.log('Min should be an integer.');
} else if(max < min){
    console.log('Max should be equal or greater than min.');
    return;
} else if(isNaN(max)){
    console.log('Max should be an integer.');
} else {
    axios.get(`https://api.punkapi.com/v2/beers?abv_gt=${min}&abv_lt=${max}`)
    .then(function (response) {
        //TODO group beers by yeast
        const beers = response.data;
        beers.forEach(b=>{
            console.log({
                yeast: b.ingredients.yeast,
                name: b.name,
                imageUrl: b.image_url,
                description: b.description,
                tagline: b.tagline,
                hopNames: b.ingredients.hops.map(h=>h.name).join(', '),
                maltNames: b.ingredients.malt.map(m=>m.name).join(', '),
            })
        })
    })
    .catch(function (error) {
        console.log(error);
    });
}
