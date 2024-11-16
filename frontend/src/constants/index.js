import paths from "@/paths"

export const MENU_ITEMS = [
    {
        title: "Lập phiếu nhập sách",
        to: paths.dashboard.bookImport
    },
    {
        title: "Lập hoá đơn bán sách",
        to: paths.dashboard.bookSell
    },
    {
        title: "Tra cứu sách",
        to: paths.dashboard.bookSearch
    },
    {
        title: "Lập báo cáo tháng",
        to: paths.dashboard.monthReport
    },
    {
        title: "Lập phiếu thu tiền",
        to: paths.dashboard.collectMoney
    },
    {
        title: "Thay đổi quy định",
        to: paths.dashboard.changeRules
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

export const INVENTORY_BOOK_FIELDS = [{
    title: "Tên sách",
    name: "title",
    type: "text"
}, {
    title: "Tác giả",
    name: "author",
    type: "text"
},
{
    title: "Tồn đầu",
    name: "firstInventory",
    type: "text"
},
{
    title: "Phát sinh",
    name: "interest",
    type: "text"
},
{
    title: "Tồn cuối",
    name: "lastInventory",
    type: "text"
}]

export const DEBT_CONSUMER_FIELDS = [{
    title: "Tên khách hàng",
    name: "name",
    type: "text"
},
{
    title: "Nợ đầu",
    name: "firstDebt",
    type: "text"
},
{
    title: "Phát sinh",
    name: "interest",
    type: "text"
},
{
    title: "Nợ cuối",
    name: "lastDebt",
    type: "text"
}]

export const SET_CONFIG = "SET_CONFIG";
export const SET_USER = "SET_USER";