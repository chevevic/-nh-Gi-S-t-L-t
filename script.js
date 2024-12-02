async function getweather(lat,lon) {
    try {
    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=5ecd55a45b022c71aede9450aaffb59d`;
    const api_url1 =  `https://api.open-elevation.com/api/v1/lookup?locations=${lat-0.0004},${lon-0.0004}|${lat + 0.0004},${lon + 0.0004}`;
    const api_url2 =`https://rest.isric.org/soilgrids/v2.0/classification/query?lon=${lon}&lat=${lat}&number_classes=12`
    const response = await fetch(api_url);
    const json = await response.json();
    console.log(json);
    const response1 = await fetch(api_url1);
    const elevationData = await response1.json();
    const elevation1 = elevationData.results[0].elevation;
    const elevation2 = elevationData.results[1].elevation;
    const distance = getDistance(lat-0.0004, lon-0.0004, lat + 0.0004, lon + 0.0004); 
    const slope = Math.atan((Math.abs(elevation2 - elevation1)) / distance)*(180 / Math.PI);
    console.log(`Slope: ${slope} °`);
    const response2 = await fetch(api_url2);
    const soiltype = await response2.json();
    console.log(soiltype);
    const response3 = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];
(
  way["landuse"](around:500, ${lat}, ${lon});
  relation["landuse"](around:500, ${lat}, ${lon});
  node["landuse"](around:5000, ${lat}, ${lon});

  way["natural"](around:500, ${lat}, ${lon});
  relation["natural"](around:500, ${lat}, ${lon});
  node["natural"](around:500, ${lat}, ${lon});

  way["boundary"](around:500, ${lat}, ${lon});
  relation["boundary"](around:500, ${lat}, ${lon});
  node["boundary"](around:500, ${lat}, ${lon});

  way["waterway"](around:500, ${lat}, ${lon});
  relation["waterway"](around:500, ${lat}, ${lon});
  node["waterway"](around:500, ${lat}, ${lon});

  way["highway"](around:500, ${lat}, ${lon});
  relation["highway"](around:500, ${lat}, ${lon});
  node["highway"](around:500, ${lat}, ${lon});

  way["building"](around:500, ${lat}, ${lon});
  relation["building"](around:500, ${lat}, ${lon});
  node["building"](around:500, ${lat}, ${lon});

  way["place"](around:500, ${lat}, ${lon});
  relation["place"](around:500, ${lat}, ${lon});
  node["place"](around:500, ${lat}, ${lon});

  way["power"](around:500, ${lat}, ${lon});
  relation["power"](around:500, ${lat}, ${lon});
  node["power"](around:500, ${lat}, ${lon});
);
out body;`);

    landuse = await response3.json();
    const ways = landuse.elements.filter(item => item.type === 'way');
    const nodes = landuse.elements.filter(item => item.type === 'node');
    const wayWithMinId = ways.reduce((minWay, currentWay) => {
        return currentWay.id < minWay.id ? currentWay : minWay;
    }, ways[0]);
    
    const nodeWithMinId = nodes.reduce((minNode, currentNode) => {
        return currentNode.id < minNode.id ? currentNode : minNode;
    }, nodes[0]);
    
    const container = document.getElementById("ways-container");
    container.innerHTML = '';
    const tagsContainer = document.createElement("div");
    if (wayWithMinId && wayWithMinId.tags) {
        for (const [key, value] of Object.entries(wayWithMinId.tags)) {
            const tagElement = document.createElement("p");
            tagElement.innerHTML = `<strong>${key}:</strong> ${value}`;
            tagsContainer.appendChild(tagElement);
        }
    } else {
        const noDataElement = document.createElement("p");
        noDataElement.innerHTML = '0';
        tagsContainer.appendChild(noDataElement);
    }
    
    if (nodeWithMinId && nodeWithMinId.tags) {
        for (const [key, value] of Object.entries(nodeWithMinId.tags)) {
            const tagElement = document.createElement("p");
            tagElement.innerHTML = `<strong>${key}:</strong> ${value}`;
            tagsContainer.appendChild(tagElement);
        }
    } else {
        const noDataElement = document.createElement("p");
        noDataElement.innerHTML = '0';
        tagsContainer.appendChild(noDataElement);
    }
    container.appendChild(tagsContainer);
    console.log(landuse);
    return {
        json,
        slope,
        soiltype,
        landuse
    };
    } catch (error) {
        console.error("An error occurred:", error);
        return 0;
    }
}
var script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
script.onload = function() {
    console.log('jQuery đã được tải thành công!');
    $('h1').text('jQuery đã được tải xong!');
};
script.onerror = function() {
    console.error('Lỗi khi tải jQuery!');
};
document.head.appendChild(script);
function getHumanData(city) {
    return new Promise((resolve, reject) => {
    var name = city
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/city?name=' + name,
        headers: { 'X-Api-Key': 'jdXat9Ki5HubXgmipMFdAA==WftEvsVIXvufKXUf'},
        contentType: 'application/json',
        success: function(result) {
            if (result && result[0] && result[0].population) {
                console.log(result);
                resolve(result[0].population);
            } else {
                resolve(156474);
            }
        },
        error: function ajaxError(jqXHR) {
            reject('Error: ', jqXHR.responseText);
        }
    });
})}
function calculateLandslideRisk(hazard, exposure, vulnerability) {
    if (hazard < 0 || exposure < 0 || vulnerability < 0) {
        return "Giá trị không hợp lệ. Tất cả các tham số phải lớn hơn hoặc bằng 0.";
    }
    let risk = hazard * exposure * vulnerability;
    return `Rủi ro sạt lở đất: ${risk}`;
}
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
function calculatehazard(slope,rain,soil,humid,wind) {
    hazard = (((slope * (rain + soil + humid + wind)) / (2*(2+2+2+2))) * 100).toFixed(0);
    return hazard
}
function getslopeFactor(slope) {
    if (slope < 1) return 0.05;
    if (slope >= 1 && slope < 3) return 0.25;
    if (slope >= 3 && slope < 10) return 0.5;
    if (slope >= 10 && slope < 18) return 1;
    if (slope >= 18 && slope <= 30) return 1.3;
    if (slope > 30 && slope <= 40) return 1.75; 
    return 2.0;
}
function getrainFactor(rainfall) {
    if (rainfall < 0.1 ) return 0.05;
    if (rainfall >=0.4 && rainfall < 1.2) return 0.25;
    if (rainfall >= 1.2 && rainfall < 2.2) return 0.5;
    if (rainfall >= 2.2 && rainfall < 5) return 1.0;
    if (rainfall >= 5 && rainfall <10) return 1.5;
    return 2.0;
}

function getsoilFactor(soil) {
    if (soil === "arenosols" || soil === "histosols") return 2.0;
    if (soil === "Vertisols" || soil === "Gleysols") return 1.5;
    if (soil === "Cambisols" || soil === "Acrisols") return 1.2;
    if (soil === "Fluvisols" || soil === "Andosols" || soil === "phaeozems" ) return 0.8;
    if (soil === "Luvisols" || soil === "Ferralsols" )  return 0.4;
    return 0.2;
}

function getwindFactor(wind) {
    if (wind < 12) return 0.1;
    if (wind >= 12 && wind < 20) return 0.5;
    if (wind >= 20 && wind < 30) return 1.0;
    if (wind >= 30 && wind <= 40) return 1.5; 
    return 2.0;
}

function getsoilmoistureFactor(humid) {
    if (humid < 10) return 0.1;
    if (humid >= 10 && humid < 15) return 0.5;
    if (humid >=15 && humid < 30) return 1.0;
    if (humid >= 30 && humid <= 40) return 1.5;
    return 2.0;
}
