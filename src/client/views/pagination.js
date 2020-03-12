page = (tagid, pagenumber, value) => {
  let id = document.getElementById(tagid);
  if (pagenumber + value > pageid) {
    id.style.display = "none";
  } else if (pagenumber - value < pageid) {
    id.style.display = "none";
  }
};
