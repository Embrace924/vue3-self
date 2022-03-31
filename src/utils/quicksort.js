function quickSort (array) {
  if (array.length < 2) {
    console.log(array);
    return array;
  }
  // 选取最后的一个点当作中间点（可以任意选择）
  let pivot = array[array.length - 1];
  // 选出小于这个点的数据
  let left = array.filter((v, i) => v <= pivot && i != array.length - 1);
  // 选出大于这个点的数据
  let right = array.filter(v => v > pivot);
  // 合在一起组成新数据 递归几次 当左边和右边
  return [...quickSort(left), pivot, ...quickSort(right)];
}
const arr = [5, 3, 7, 9, 0, 2, 1, 6]; // 8
console.log(quickSort(arr));
