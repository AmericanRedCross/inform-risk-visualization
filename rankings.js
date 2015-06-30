regions = ["GLOBE", "AFRICA", "AMEE", "LAC", "US"];

rankings = {
  GLOBE: [],
  AFRICA: [],
  AMEE: [],
  LAC: [],
  US: []
};

function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function populateRankings(riskArray) {

  countriesData.features.map(function(feature) {
    rankings["GLOBE"].push(feature.properties.sovereignt);
    var riskLevelObject = riskArray[findIndex(riskArray, "ISO3", feature.properties.ISO3)];
    if (riskLevelObject) {
      rankings[feature.properties.AmCrossRegion].push(riskLevelObject.COUNTRY);
    }
  });

}

// Returns index of an attribute with a certain value within an array
var findIndex = function(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

// grap value of the selected metric given country code
function getValue(riskArray, field, key) {
  if (findIndex(riskArray, field, key)) {
    return riskArray[findIndex(riskArray, field, key)][selectedMetric]; }
  else {
    return undefined;
  }
}

function rank(riskArray) {

  for (var i = 0; i < 5; i++) {

    rankings[regions[i]].sort(function(a,b) {
      return d3.descending(
        getValue(riskArray, "COUNTRY", a),
        getValue(riskArray, "COUNTRY", b));
    });

  }

  console.log("Top 3 most vulnerable globally: \n" + "1. " + rankings.GLOBE[0] + "\n" + "2. " + rankings.GLOBE[1] + "\n" + "3. " + rankings.GLOBE[2]);

}

function getISO3(riskArray, nameOfCountry) {
  if (findIndex(riskArray, "COUNTRY", nameOfCountry)) {
    return riskArray[findIndex(riskArray, "COUNTRY", nameOfCountry)]["ISO3"]; }
  else {
    return undefined;
  }
}

function findRank(country) {

  var result = { amCrossRegion : "", REGION: "", GLOBE: "" };
  result.GLOBE = ordinalSuffixOf(rankings.GLOBE.indexOf(country) + 1);
  for (var i = 1; i < 5; i++) {
    if (rankings[regions[i]].indexOf(country) >= 0) { result.amCrossRegion = regions[i] }
  }
  result.REGION = ordinalSuffixOf(rankings[result.amCrossRegion].indexOf(country) + 1);
  return result;

}
