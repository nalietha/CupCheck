class utils {
    static formatDate(dateString: string) {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }   

    static formatPrice(price: number | null) {
        if (price === null || price === undefined) return '';
        return `$${price.toFixed(2)}`;
    }
}