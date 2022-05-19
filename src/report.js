const { getTrips, getDriver, getVehicle } = require("api");
/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // I declared a variable called responseData that will grab everything in the getTrips API
  let getTripsData = await getTrips();
  let responseData = [...getTripsData];
  // responseData;
  // This will be my final Array that will grab all my report details
  let collector = [];
  // here i want to save my drivers ID so that i can use it later so from the responseData is just collected
  // the driversId and store it as uniqueID
  let uniqueID = responseData
    .map((item) => item.driverID)
    .filter((item, index, arr) => {
      return arr.indexOf(item) === index;
    });
  uniqueID;

  for (let i = 0; i < uniqueID.length; i++) {
    let count = 0;
    let trips = [];
    let cashCount = 0;
    let nonCashCount = 0;
    let totalAmountEarned = 0;
    let totalCashAmount = 0;
    let totalNonCashAmount = 0;
    let vehicleInfo = [];
    responseData.forEach((item) => {
      let nums = Number(+`${item.billedAmount}`.split(",").join(""));

      if (item.driverID === uniqueID[i]) {
        totalAmountEarned += nums;
        trips.push({
          user: item.user.name,
          created: item.created,
          pickup: item.pickup.address,
          destination: item.destination.address,
          billed: nums,
          isCash: item.isCash,
        });
        count++;
      }
      if (item.isCash) {
        cashCount++;
        totalCashAmount += nums;
      } else {
        nonCashCount++;
        totalNonCashAmount += nums;
      }
    });
    try {
      let driverData = await getDriver(uniqueID[i]);

      for (let j = 0; j < driverData.vehicleID.length; j++) {
        let vehicleData = await getVehicle(driverData.vehicleID[j]);

        vehicleInfo.push({
          plate: vehicleData.plate,
          manufacturer: vehicleData.manufacturer,
        });
      }
      collector.push({
        fullName: driverData.name,
        id: uniqueID[i],
        phone: driverData.phone,
        noOfTrips: count,
        noOfVehicles: driverData.vehicleID.length,
        vehicles: vehicleInfo,
        noOfCashTrips: cashCount,
        noOfNonCashTrips: nonCashCount,
        totalAmountEarned: Number(totalAmountEarned.toFixed(2)),
        totalCashAmount: Number(totalCashAmount.toFixed(2)),
        totalNonCashAmount: Number(totalNonCashAmount.toFixed(2)),
        trips: trips,
      });
    } catch {
      if (!collector.includes(uniqueID[i])) {
        collector.push({
          id: uniqueID[i],
          noOfTrips: count,
          noOfCashTrips: cashCount,
          noOfNonCashTrips: nonCashCount,
          trips: trips,
          totalAmountEarned: Number(totalAmountEarned.toFixed(2)),
          totalCashAmount: Number(totalCashAmount.toFixed(2)),
          totalNonCashAmount: Number(totalNonCashAmount.toFixed(2)),
        });
      }
    }
  }

  return collector;
}
driverReport();

module.exports = driverReport;
