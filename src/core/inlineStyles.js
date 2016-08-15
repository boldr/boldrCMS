const midnightBlue = '#2A3140';
const cyanLike = '#36C6D1';
const boldrPink = '#DD144D';
const grape = '#40404E';
const txtColor = 'rgba(0,0,0,.87)';

export default {
  dashboardAppBar: {
    backgroundColor: midnightBlue,
    marginBottom: '1em'
  },
  toolbar: {
    backgroundColor: boldrPink,
    color: '#fafafa'
  },
  headerOverflow: {
    backgroundColor: midnightBlue,
    paddingTop: '50px',
    height: '110px',
    marginBottom: '50px'
  },
  underlineFocusStyle: {
    borderColor: cyanLike
  },
  headerColumn: {
    color: '#B3B3B3',
    fontWeight: 'bold',
  },
  row: {
    lineHeight: 1.6,
    fontSize: 14,
  },
  rowColumn: {
    whiteSpace: 'normal',
    overFlow: 'visible',
    height: 70,
    paddingLeft: 16,
    paddingRight: 16,
  },
  floatButton: {
    position: 'fixed',
    zIndex: 100,
    bottom: '5%',
    right: '3%',
  }
};
