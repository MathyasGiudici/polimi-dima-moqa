// Mock data object used for LineChart and BarChart

export const testDataSet = {
  labels: [],
  datasets: [{
    data: [0],
  },{
    data: [0],
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
