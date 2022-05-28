let data = ["dog", "bird", "rabbit", "cat"];

function findCat(data) {
  for (const item of data) {
    if (item === "cat") {
      return item;
    }
  }

  return null
}
console.log(findCat(data));
