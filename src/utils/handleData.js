
const legendData = ['经常去', '去过几次', '去过一次', '没去过'];
const NEVER = 0;
const ONECE = 40;
const AFEWTIMES = 75;
const USUALLY = 90;
const FREQUENCY = [NEVER, ONECE, AFEWTIMES, USUALLY];
const LEBEL_COLOR = '#305f3e';

function handleData(rowData) {
  const userData = rowData.map((item) => {
    const value = FREQUENCY[item.degree];
    let tag = '';
    if (value === NEVER) {
      [,,, tag] = legendData;
    } else if (value === ONECE) {
      [,, tag] = legendData;
    } else if (value === AFEWTIMES) {
      [, tag] = legendData;
    } else {
      [tag] = legendData;
    }
    return {
      ...item,
      value,
      label: value === NEVER ? null : { show: true, color: LEBEL_COLOR },
      tag,
    };
  });
  const countList = {
    nCount: 0,
    oCount: 0,
    aCount: 0,
    uCount: 0,
  };
  userData.forEach((item) => {
    if (item.value === NEVER) {
      countList.nCount++;
    } else if (item.value === ONECE) {
      countList.oCount++;
    } else if (item.value === AFEWTIMES) {
      countList.aCount++;
    } else {
      countList.uCount++;
    }
  });
  return { userData, countList };
}


export default handleData;
