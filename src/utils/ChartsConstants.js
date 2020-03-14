// Mock data object used for LineChart and BarChart

export const testDataSet = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    data: [
      20,
      80,
      55,
      56,
      87,
      90
    ],
  },{
    data: [
      30,
      90,
      67,
      54,
      50,
      44
    ],
    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})` // optional
  }]
}

export function getChartConfigs(){
  return {
      backgroundColor: "#fff",
      backgroundGradientFrom: "#fff",
      backgroundGradientTo: "#fff",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(0, 0, 139, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 139, ${opacity})`,
      style: {
        borderRadius: 16
      },
    };
}
