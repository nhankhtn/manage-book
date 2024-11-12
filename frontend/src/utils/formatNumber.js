function formatCurrency(amount) {
    return amount.toLocaleString('vi', { style: 'currency', currency: 'VND' });
}

export { formatCurrency };
