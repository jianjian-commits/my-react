export default function selectCom(key, arr) {
  const item = arr.filter(item => {
    if (item.key === parseInt(key)) {
      return item;
    }
  });
  return item[0];
}
