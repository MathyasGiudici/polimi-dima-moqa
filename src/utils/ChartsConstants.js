// Mock data object used for LineChart and BarChart

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    data: [
      50,
      20,
      2,
      86,
      71,
      100
    ],
    color: (opacity = 1) => `rgba(0, 65, 244, ${opacity})` // optional
  },{
    data: [
      20,
      10,
      4,
      56,
      87,
      90
    ]
  },{
    data: [
      30,
      90,
      67,
      54,
      10,
      2
    ]
  }]
}

// Mock data object used for Contribution Graph

const contributionData = [
  { date: '2016-01-02', count: 1 },
  { date: '2016-01-03', count: 2 },
  { date: '2016-01-04', count: 3 },
  { date: '2016-01-05', count: 4 },
  { date: '2016-01-06', count: 5 },
  { date: '2016-01-30', count: 2 },
  { date: '2016-01-31', count: 3 },
  { date: '2016-03-01', count: 2 },
  { date: '2016-04-02', count: 4 },
  { date: '2016-03-05', count: 2 },
  { date: '2016-02-30', count: 4 }
]

// Mock data object for Pie Chart

const pieChartData = [
  { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'New York', population: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
]

// Mock data object for Progress

const progressChartData = [0.4, 0.6, 0.8]

export { data, contributionData, pieChartData, progressChartData }


export function getChartConfigs(){
  return [
    {
      backgroundColor: '#000000',
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16
      }
    },
    {
      backgroundColor: '#022173',
      backgroundGradientFrom: '#022173',
      backgroundGradientTo: '#1b3fa0',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }
    },
    {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
    },
    {
      backgroundColor: '#26872a',
      backgroundGradientFrom: '#43a047',
      backgroundGradientTo: '#66bb6a',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }
    },
    {
      backgroundColor: '#000000',
      backgroundGradientFrom: '#000000',
      backgroundGradientTo: '#000000',
      color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
    }, {
      backgroundColor: '#0091EA',
      backgroundGradientFrom: '#0091EA',
      backgroundGradientTo: '#0091EA',
      color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`
    },
    {
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }
    },
    {
      backgroundColor: '#b90602',
      backgroundGradientFrom: '#e53935',
      backgroundGradientTo: '#ef5350',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      }
    },
    {
      backgroundColor: '#ff3e03',
      backgroundGradientFrom: '#ff3e03',
      backgroundGradientTo: '#ff3e03',
      color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`
    }
  ];
}
