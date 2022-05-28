function binarySearch(data, x) {
  let start = 0;
  let end = data.length - 1;

  while (start <= end) {
    let middle = Math.floor((start + end) / 2);
    console.log(middle)
    if (data[middle] === x) {
      return true;
    } else if (data[middle] < x) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }

  return false;
}

let sortedData = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(binarySearch(sortedData, 1));