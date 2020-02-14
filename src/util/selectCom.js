export default function selectCom(key, arr) {
  const item = arr.filter(item => {
    if (item.key === parseInt(key)) {
      return item;
    }
    return 0;
  });
  return item[0];
}
