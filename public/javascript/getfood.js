var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if(xhttp.readyState == 4 && xhttp.status == 200) {
    console.log(xhttp.responseText);
  }
}

// Don't go over limit!
//xhttp.open("GET", "http://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=DEMO_KEY&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=01009", true);
//xhttp.send();