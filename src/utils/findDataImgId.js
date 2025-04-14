//通过分页10列表中的图片ID去没有分页的全部列表中ID所在索引
export const findDataImgId = (imgList, imgdata_id) => {
    let left = 0, right = imgList.length - 1
    let middle = left + right >> 1
    while (left <= right) {
        if (imgList[middle].id > imgdata_id) {
            right = middle - 1
            middle = left + right >> 1
        } else if (imgList[middle].id < imgdata_id) {
            left = middle + 1
            middle = left + right >> 1
        } else {
            return middle + 1
        }
    }
    return -1
}