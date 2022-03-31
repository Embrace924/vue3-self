const arr = [6, 5, 3, 7, 8, 2, 9];

function maopao (arr) {
  for (let i = 0; i < arr.length; i++) {
    let temp = arr[i];
    for (let j = 0; j < arr.length; j++) {
      console.log('比较的值', arr[i], arr[j]);
      if (arr[i] > arr[j]) {
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
      }
    }
  }
  console.log(arr);
}
maopao(arr);
