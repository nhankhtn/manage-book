export const MENU_ITEMS = [
    {
        title: "Lập phiếu nhập sách",
        to: "/book-import"
    },
    {
        title: "Lập hoá đơn bán sách",
        to: "/book-sell"
    },
    {
        title: "Tra cứu sách",
        to: "/book-search"
    },
    {
        title: "Lập báo cáo tháng",
        to: "/month-report"
    },
    {
        title: "Lập phiếu thu tiền",
        to: "/collect-money"
    },
    {
        title: "Thay đổi quy định",
        to: "/change-rules"
    }
]

export const BOOK_FIELDS = [{
    title: "Tên sách",
    name: "title",
    type: "text"
}, {
    title: "Tác giả",
    name: "author",
    type: "text"
},
{
    title: "Thể loại",
    name: "category",
    type: "text"
},
{
    title: "Số lượng",
    name: "amount",
    type: "text"
},
{
    title: "Giá",
    name: "price",
    type: "text"
}, {
    name: "deleteBook",
    type: "button"
}]
export const SELL_BOOK_FIELDS = [{
    title: "Tên sách",
    name: "title",
    type: "text"
}, {
    title: "Tác giả",
    name: "author",
    type: "text"
},
{
    title: "Thể loại",
    name: "category",
    type: "text"
}, {
    title: "Có sẵn",
    name: "quantity",
    type: "text"
},
{
    title: "Giá",
    name: "price",
    type: "text"
}, {
    title: "Số lượng",
    name: "amount",
    type: "input"
}]

export const SEARCH_BOOK_FIELDS = [{
    title: "Tên sách",
    name: "title",
    type: "text"
}, {
    title: "Tác giả",
    name: "author",
    type: "text"
},
{
    title: "Thể loại",
    name: "category",
    type: "text"
}, {
    title: "Số lượng",
    name: "available",
    type: "text"
},
{
    title: "Giá",
    name: "price",
    type: "text"
}]