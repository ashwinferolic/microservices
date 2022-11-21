const paginate = (list, page, limit, totalCount) => {
  let total = totalCount;
  let currentPage = page ? +page : 1;
  let totalPages = Math.ceil(total / limit);
  let pageMeta = {};
  pageMeta.limit = limit;
  pageMeta.page = currentPage;
  pageMeta.totalData = total;
  pageMeta.totalPages = totalPages;

  if (list.length <= 0) {
    return { message: "no search results" };
  } else {
    return { list, pageMeta };
  }
};

module.exports = { paginate };
