// Default state object
export function getDefaultState() {
  return {
    settings: {
      wifi: {
        ip: 'http://192.168.1.173',
        port: '3000'
      },
      rtk: {
        ip: 'http://158.102.7.10',
        port: '2101'
      },
    },
    blob : {
    }
  };
};
