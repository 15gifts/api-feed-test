const axios = require('axios');
const args = process.argv.slice(2);
let min = -1;
let max = 0;
args.forEach(e=>{
    if(e.includes('--min=')){
        min = e.replace('--min=', '');
    } else if(e.includes('--max=')){
        max = e.replace('--max=', '');
    }
    
});

min = parseInt(min, 10);
max = parseInt(max, 10);

if(min < 0){
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
        //TODO sort beers by yeast
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
