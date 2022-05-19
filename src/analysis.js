const { getTrips, getDriver } = require("api"); //i imported  getTrips and getDriver to access trips and driver respectively

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  let tripInfo = await getTrips();

  let count1 = 0;
  let count2 = 0;
  let total1 = 0;
  let total2 = 0;
  let cashBilledTotal = 0;
  let finalObj = {};

  let noOfDriversWithMoreThanOneVehicle = 0; //store number of drivers with more than one vehicle
  let highestNumberOfTrips = 0; // store the highest number of trips
  let highestEarning = 0; // store the highest earning

  //get unique driver ID
  let arr = tripInfo.map((trip) => trip.driverID);
  //remove duplicate driverIDs from arr
  arr = [...new Set(arr)];

  //create driverPromiseArr
  let driverPromiseArr = arr.map((driverId) =>
    getDriver(driverId).catch((err) => {
      return { vehicleID: [] };
    })
  );
  //get the drivers object
  let driverObjArr = await Promise.all(driverPromiseArr);
  driverObjArr;

  //calcuated the number of drivers with more than one vehicle
  for (let driver of driverObjArr) {
    let noCurrentDriverVehicle = driver.vehicleID.length;
    if (noCurrentDriverVehicle > 1) {
      noOfDriversWithMoreThanOneVehicle++;
    }
  }

  //created an object that maps drivers Id to the corresponding driver Object
  let driversMap = {};
  for (let index = 0; index < driverObjArr.length; index++) {
    driversMap[arr[index]] = {
      ...driverObjArr[index],
      noOfTrips: 0,
      earnings: 0,
    };
  }

  driversMap;
  driverObjArr;

  // let driversArr = [];

  for (let value of tripInfo) {
    let totalCash = +value["billedAmount"].toString().replace(",", "");
    if (value["isCash"]) {
      count1++;
      total1 += totalCash;
      //cashBilledTotal += totalCash
    } else {
      count2++;
      total2 += totalCash;
    }
    //get the driver for the current trip
    let currentDriver = driversMap[value.driverID];
    //update the noOfTrips and earnings for current driver
    currentDriver.noOfTrips++;
    currentDriver.earnings += +value["billedAmount"]
      .toString()
      .replace(",", "");

    //update highest trips
    if (currentDriver.noOfTrips > highestNumberOfTrips) {
      highestNumberOfTrips = currentDriver.noOfTrips;
    }

    //update highest earnings.
    if (currentDriver.earnings > highestEarning) {
      highestEarning = currentDriver.earnings;
    }
  }

  console.log(arr);
  let total3 = +total2.toFixed(2);
  let finalTotal = total1 + total3;
  // console.log(count1);
  // console.log(count2);
  // console.log(total1);
  // console.log(total2);
  // console.log(finalTotal);
  // console.log(total3);
  //To populate the data
  finalObj["noOfCashTrips"] = count1;
  finalObj["noOfNonCashTrips"] = count2;
  finalObj["billedTotal"] = finalTotal;
  finalObj["cashBilledTotal"] = total1;
  finalObj["nonCashBilledTotal"] = total3;
  finalObj["noOfDriversWithMoreThanOneVehicle"] =
    noOfDriversWithMoreThanOneVehicle;

  //get driver with the highest number of trips
  let driverHighestTrips = Object.values(driversMap).find(
    (driverObj) => driverObj.noOfTrips === highestNumberOfTrips
  );

  let driverHighestEarnings = Object.values(driversMap).find(
    (driverObj) => driverObj.earnings === highestEarning
  );

  finalObj["mostTripsByDriver"] = {
    name: driverHighestTrips.name,
    email: driverHighestTrips.email,
    phone: driverHighestTrips.phone,
    noOfTrips: driverHighestTrips.noOfTrips,
    totalAmountEarned: driverHighestTrips.earnings,
  };
  finalObj["highestEarningDriver"] = {
    name: driverHighestEarnings.name,
    email: driverHighestEarnings.email,
    phone: driverHighestEarnings.phone,
    noOfTrips: driverHighestEarnings.noOfTrips,
    totalAmountEarned: driverHighestEarnings.earnings,
  };

  finalObj;
  return finalObj;
}
analysis();
module.exports = analysis;
