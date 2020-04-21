$(document).ready(function() {
    zoom = 16

    function initMap(localizacaoCentral) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: zoom,
            center: localizacaoCentral,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
        });
        infowindow = new google.maps.InfoWindow();
    }

    async function dataCollect_old(location, index) {
        return new Promise(resolve => {
            var request = {
                location: location,
                radius: raio / 2,
                // fields: ['geometry', 'types']
                //  type: ['restaurant']
                //   query: 'restaurant'
            }
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status, pagetoken) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    //arrayNearbySearch = results;
                    var j = 0;
                    var page = 0;
                    do {
                        if (j != 0) {
                            pagetoken.nextPage();
                        }
                        for (let i = j; i < results.length + j; i++) {
                            placeMarker(results[i], location);

                        }
                        squaresArray[index].places.push(results);
                        page++;
                        j += 20;

                    } while (pagetoken.hasNextPage);

                    /*                for (let i = 0; i < results.length; i++) {
                                                          placeMarker(results[i], location);
                                                      }
                                                      squaresArray[index].places.push(results);
                                                      if (pagetoken.hasNextpage) {
                                                          pagetoken.nextPage();
                                                      }
*/
                }
            })
        })

    }
    async function dataCollect(location, index) {
        return new Promise(resolve => {
            var request = {
                location: location,
                radius: raio / 2,
                // fields: ['geometry', 'types']
                //  type: ['restaurant']
                //   query: 'restaurant'
            }
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function(results, status, pagetoken) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    squaresArray[index].places.push(results);
                    if (pagetoken.hasNextPage) {
                        pagetoken.nextPage()
                    } else {
                        for (let i = 0; i < squaresArray[index].places.length; i++) {
                            var places = squaresArray[index].places[i];
                            for (let j = 0; j < places.length; j++) {
                                placeMarker(places[j], location, index);
                            }

                        }
                    }
                } else {
                    console.log("Deu ruim:" + status)
                }

            })

        })

    }

    function findCategories(category) {
        var valor;
        Object.keys(categories).forEach(function(item) {
            if (categories[item].indexOf(category) !== -1) {
                valor = item;
            }
        })
        return valor;


    }

    function colorPlace(type) {
        switch (type) {
            case 'food':
                return '#6A5ACD'
                break;
            case 'finance':
                return '#4682B4'
                break;
            case 'administrative':
                return '#D2691E'
                break;
            case 'transport':
                return '#00FF7F'
                break;
            case 'cultural':
                return '#FFD700'
                break;
            case 'entertainment':
                return '#006400'
                break;
            case 'health':
                return '#ADFF2F'
                break;
            case 'services':
                return '#00008B'
                break;
            case 'religious':
                return '#8B4513'
                break;
            case 'stores':
                return '#BC8F8F'
                break;
            case 'miscellaneous':
                return '#8B0000'
                break;

            default:
                return "#000";
        }
    }

    /* function summarizaArray() {

        squaresArray.forEach((element, index) => {
            var a = [],
                b = [],
                prev;
            var arraySort = element.categories.sort();

            for (let i = 0; i < arraySort.length; i++) {
                if (arraySort[i] !== prev) {
                    a.push(arraySort[i]);
                    b.push(1)
                } else {
                    b[b.length - 1]++;
                }
                prev = arraySort[i]

            }
            var sumarize = []
            a.forEach(function(item, index) {
                sumarize[item] = b[index]
            })
            squaresArray[index].summarize = sumarize;
        });
        var myJson = JSON.stringify(squaresArray)

        $.ajax({
            type: 'POST',
            url: "/transferDataToServer/",
            data: { data: myJson },
            dataType: 'json'
        })
    }
    */
    function sendData() {
        var myJson = JSON.stringify(squaresArray)
        $.ajax({
            type: 'POST',
            url: "/transferDataToServer/",
            data: { data: myJson },
            dataType: 'json'
        })
    }

    function placeMarker(place, centerLocation, index) {

        /*     if (typeof place !== 'object') {
            console.log("erro");
        } else {
*/
        var placeLoc = place.geometry.location;
        var type = place.types[0];
        var category = findCategories(type);
        var cor = colorPlace(category);
        if (google.maps.geometry.spherical.computeDistanceBetween(placeLoc, centerLocation) > raio) return;
        squaresArray[index].categories.push(category)
        var marker = new google.maps.Circle({
            center: placeLoc,
            radius: raio / zoom * .4,
            fillColor: cor,
            fillOpacity: 1,
            strokeColor: '#191970',
            strokeWeight: 0,
            // strokeOpacity: 0.6,
            map: map

        })

        //markerArray.push(new google.maps.Marker({
        /*var marker = new google.maps.Marker({
                position: placeLoc,
                map: map
            })*/
        //markerArray.push(marker)

        google.maps.event.addListener(marker, 'click', function() {
            $("#spnLocal").html(category);
            //  infowindow.setContent(category);
            // infowindow.open(map, this);
        });
        //      }
    }

    function drawCicles() {
        circleArray = [];
        centerArray = [];
        markerArray = [];
        //   placesArray = [];
        raio = parseInt($('#lblRadius').text());
        //       google.maps.event.addListener(map, 'bounds_changed', function() {
        limites = map.getBounds();
        tr = limites.getNorthEast();
        bl = limites.getSouthWest();
        tl = new google.maps.LatLng(tr.lat(), bl.lng());
        br = new google.maps.LatLng(bl.lat(), tr.lng());

        var distancia = google.maps.geometry.spherical;
        var circleTopLeft = distancia.computeOffset(tl, raio, 135)
        var circleTopRight = distancia.computeOffset(tr, raio, 225)
        var circleButtonLeft = distancia.computeOffset(bl, raio, 45)
            //    var circleButtonRight = distancia.computeOffset(br, raio, 315)

        var nextCircle = circleTopLeft;
        var line = 1;
        for (let lat = nextCircle.lat(); lat > circleButtonLeft.lat(); lat = distancia.computeOffset(nextCircle, raio * 1.7, 180).lat()) {
            if (line % 2) {
                lng_distancia = circleTopLeft.lng()

            } else {
                lng_distancia = distancia.computeOffset(circleTopLeft, (raio * 1.7) / 2, 90).lng()
            }
            for (let lng = lng_distancia; lng < circleTopRight.lng(); lng = distancia.computeOffset(nextCircle, raio * 1.7, 90).lng()) {
                var circlePositionCenter = new google.maps.LatLng(lat, lng);
                circleArray.push(new google.maps.Circle({
                    center: circlePositionCenter,
                    radius: raio,
                    fillColor: '#836FFF',
                    fillOpacity: .1,
                    strokeColor: '#191970',
                    strokeWeight: 1,
                    strokeOpacity: 0.6,
                    map: map

                }))

                circleArray.push(new google.maps.Circle({
                    center: circlePositionCenter,
                    radius: raio * .05,
                    fillColor: '#836FFF',
                    fillOpacity: 1,
                    strokeColor: '#191970',
                    strokeWeight: 0,
                    // strokeOpacity: 0.6,
                    map: map

                }))
                centerArray.push(circlePositionCenter);
                //dataCollect(circlePositionCenter, raio)
                nextCircle = new google.maps.LatLng(nextCircle.lat(), lng);

            }
            line++;
            nextCircle = new google.maps.LatLng(lat, circleTopLeft.lng());
        }
        //     })

    }

    function drawSquares() {
        squaresArray = [];
        //   placesArray = [];
        raio = parseInt($('#txtRadius').val());
        //       google.maps.event.addListener(map, 'bounds_changed', function() {
        limites = map.getBounds();
        var distancia = google.maps.geometry.spherical;
        tr = distancia.computeOffset(limites.getNorthEast(), raio * .2, 225);
        bl = distancia.computeOffset(limites.getSouthWest(), raio * .2, 45);
        tl = new google.maps.LatLng(tr.lat(), bl.lng());
        br = new google.maps.LatLng(bl.lat(), tr.lng());



        var circleTopLeft = distancia.computeOffset(tl, raio, 135)
        var circleTopRight = distancia.computeOffset(tr, raio, 225)
        var circleButtonLeft = distancia.computeOffset(bl, raio, 45)



        var nextSquare = tl;
        var id = 1;
        var col = 1;
        var row = 1;

        for (let j = tl.lat(); j > distancia.computeOffset(br, raio, 0).lat(); j = nextSquare.lat()) {
            for (let i = tl.lng(); i < distancia.computeOffset(tr, raio, 270).lng(); i = nextSquare.lng()) {
                var north = nextSquare.lat();
                var south = distancia.computeOffset(nextSquare, raio, 180).lat();
                var east = distancia.computeOffset(nextSquare, raio, 90).lng();
                var west = distancia.computeOffset(nextSquare, raio, 180).lng();
                var PositionCenter = new google.maps.LatLng(distancia.computeOffset(nextSquare, raio / 2, 180).lat(), distancia.computeOffset(nextSquare, raio / 2, 90).lng());
                new google.maps.Rectangle({
                        //  center: circlePositionCenter,
                        //  radius: raio,
                        fillColor: '#836FFF',
                        fillOpacity: .1,
                        strokeColor: '#191970',
                        strokeWeight: 1,
                        strokeOpacity: 0.6,
                        bounds: {
                            north: north,
                            south: south,
                            east: east,
                            west: west,
                            // west: distancia.computeOffset(tl, Math.sqrt(2 * Math.pow(raio, 2)), 90).lng(),
                        },
                        map: map
                    })
                    /*     new google.maps.Circle({
                             center: PositionCenter,
                             radius: raio * .05,
                             fillColor: '#836FFF',
                             fillOpacity: 1,
                             strokeColor: '#191970',
                             strokeWeight: 0,
                             // strokeOpacity: 0.6,
                             map: map

                         })
                         */
                squaresArray.push({
                    id: id,
                    col: col,
                    row: row,
                    location: PositionCenter,
                    places: [],
                    categories: [],
                    bounds: {
                        north: north,
                        south: south,
                        east: east,
                        west: west,
                    },


                })
                id++;
                col++;
                nextSquare = distancia.computeOffset(nextSquare, raio, 90);
            }
            row++;
            nextSquare = new google.maps.LatLng(distancia.computeOffset(nextSquare, raio, 180).lat(), tl.lng());
        }


    }

    function insertMongo() {
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://rafael:061203jr@cluster0-byjtu.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true });
        client.connect(err => {
            const collection = client.db("test").collection("devices");

            var doc = { name: "Roshan", age: "22" };

            db.collection("users").insertOne(doc, function(err, res) {
                if (err) throw err;
                console.log("Document inserted");
                // close the connection to db when you are done with it
                db.close();
            });
            // perform actions on the collection object
            client.close();
        });

    }


    localizacaoCentral = new google.maps.LatLng(-22.1276, -51.3856);

    // Create the Google Map…
    var map;
    initMap(localizacaoCentral);

    //  insertMongo()


    $('#createCircle').click(function() {
        // drawCicles();
        drawSquares()
    })
    $("#sumarize").on('click', function() {
        //summarizaArray();
        sendData();
    })

    $('#places').on('click', function() {
        //      dataCollect(centerArray[25])
        //   const wait = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

        const doRequest = (location, index) => new Promise(
            resolve => {
                //console.log(requestNumber + 'request done');
                dataCollect(location, index)
                resolve();
            })

        const run = async() => {
            //       for (let i of centerArray) {
            for (let i of squaresArray) {
                await doRequest(i.location, i.id - 1);
                // await wait();
                await new Promise(resolve => setTimeout(resolve, parseInt($("#latencia").val())));
            }
        }

        run().then(() => console.log("finish"))
            /*  for (let i = 0; i < centerArray.length; i++) {
            setInterval(() => {
                dataCollect(centerArray[i])                     
            }, 1000);
        }

*/





        /*    centerArray.forEach(element => {
                if (!dataCollect(element)) {

                }
            });
            */
    })



    /*   google.maps.event.addListener(map, 'zoom_changed', function() {
            //apaga os circulos
            for (let i = 0; i < circleArray.length; i++) {
                circleArray[i].setMap(null);
            }
            //apaga os marcadores
            for (let i = 0; i < markerArray.length; i++) {
                markerArray[i].setMap(null);
            }
        })
    */
    //  })
})