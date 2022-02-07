const flightdata = require('flight-data');

// Get the real-time flight information for flight 2102 to Seattle (SEA)
flightdata.flights(
    {
        API_TOKEN: 'b5409bfc9962b2f21819efecc0adec2b',
        options: {
            limit: 1,
            flight_number: '2289',
            arr_iata: 'TPA'
        }
    })
    .then(response => {
    console.log(response.data[0].arrival)
    })
    .catch(error => {
        console.log(error)
    });


