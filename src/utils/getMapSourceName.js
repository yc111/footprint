
import kingdoms from '../config/kingdoms';
import provinces from '../config/china.province';
import cities from '../config/china.cityies';

function getMapSourceName(areaName) {
  const kingdom = kingdoms.find((item) => item.name === areaName);
  if (kingdom) {
    return { level: 1, sourceName: kingdom.map };
  }
  const province = provinces.find((item) => item.name === areaName);
  if (province) {
    return { level: 2, sourceName: province.map };
  }
  const city = cities.find((item) => item.name === areaName);
  if (city) {
    return { level: 3, sourceName: city.map };
  }
  // console.log(`Could'nt find map of "${areaName}".`);
  return null;
}

export default getMapSourceName;
