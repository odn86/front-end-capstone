// Author(s): John Dulaney
// Purpose: this module hosts a factory of functions for $http calls to the API. These functions are called in other modules
// ┌(° ͜ʖ͡°)┘

// Imports
angular.module("StockApp")
    // naming the factory, passing in appropriate angular methods
    .factory("StocksFactory", function ($http, $timeout, $location, $route, AuthFactory) {
        const firebaseURL = "everyday-stock-app.firebaseio.com"
        return Object.create(null, {
            "cache": {
                value: null,
                writable: true
            },
            // gets all stored data from fb, places it into the cache
            "all": {
                value: function () {
                    return firebase.auth().currentUser.getToken(true)
                        .then(idToken => {
                            return $http({
                                method: "GET",
                                url: `${firebaseURL}/storedStock/.json?auth=${idToken}`
                            }).then(response => {
                                const data = response.data
                                this.cache = Object.keys(data).map(key => {
                                    data[key].id = key
                                    return data[key]
                                })
                                return this.cache
                            })
                        })
                }
            },
            // saves stock symbol and uid into FB
            "save": {
                value: function (stock, topStock) {
                    console.log(stock)
                    // console.log(topStock)
                    return firebase.auth().currentUser.getToken(true)
                        .then(idtoken => {
                            return $http({
                                method: "POST",
                                url: `https://${firebaseURL}/storedStock/.json?auth=${idtoken}`,
                                data: {
                                    stock: stock.symbol,
                                    uid: firebase.auth().currentUser.uid,
                                }
                                // function symbolCheck () {
                                //     if (topStock.symbol === undefined) {
                                //         return stock.symbol
                                //     } else if (stock.symbol === undefined){
                                //         return topStock.symbol
                                //     } else if (topStock.symbol === undefined && stock.symbol === undefined){
                                //         window.alert("you did not type anything in")
                                //     }
                                // }
                            }).catch(function (error) {
                                window.alert("Error adding stock. Sry fam.")
                            })
                        })
                }
            },
            // Filter function for the stored stocks/ids to only get the objects uniqut to the current uid
            "show": {
                value: function () {
                    console.log("Dashboard saved stocks request sent. (Firebase)")
                    const currentUserID = AuthFactory.authCache()
                    return firebase.auth().currentUser.getToken(true)
                        .then(idtoken => {
                            return $http({
                                    method: "GET",
                                    url: `https://${firebaseURL}/storedStock/.json?auth=${idtoken}&orderBy="uid"&equalTo="${currentUserID.uid}"`
                                })
                                .catch(function (error) {
                                    window.alert("Error Fetching dashboard Data.")
                                })
                            console.log(this.cache)
                            return this.cache
                        })
                }
            },
            // this GET will be used for BTC as well, once it works
            "dashQuote": {
                value: function (tickerSymbol) {
                    console.log("Dashboard quote request sent. (api)")
                    return $http({
                        method: "GET",
                        url: `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${tickerSymbol}&interval=1min&apikey=ZZ2RS5PN56S260FBx`
                        // 2. 3-4 letters symbol = quoteRequest[0].symbol
                    }).then(response => {
                        const timeSeries = response.data["Time Series (1min)"]
                            //if statement here for checking if null
                        const timeSeriesArray = Object.keys(timeSeries)
                            .map(key => {
                                return timeSeries[key]
                            })

                        let lastQuote = timeSeriesArray[timeSeriesArray.length - 1]
                        lastQuote = lastQuote["2. high"]

                        lastQuoteObject = {
                            "price": lastQuote,
                            "symbol": response.data["Meta Data"]["2. Symbol"]
                        }


                        return lastQuoteObject
                    })
                }
            },
            "quote": {
                value: function (stock) {
                    console.log("Manual quote request sent. (api)")
                    return $http({
                        method: "GET",
                        url: `https://www.alphavantage.co/query?function=TIME_SERIES_${quoteRequest[0].series}&symbol=${quoteRequest[0].symbol}&interval=${quoteRequest[0].interval}&apikey=ZZ2RS5PN56S260FBx`
                        // 2. 3-4 letters symbol = quoteRequest[0].symbol
                    }).then(response => {   
                            const data = response.data
                            this.cache = Object.keys(data).map(key => {
                                data[key].id = key
                                console.log(data[key])
                                return data[key]
                            })
                            return this.cache
                        }

                    )
                }
            }
        })
    })