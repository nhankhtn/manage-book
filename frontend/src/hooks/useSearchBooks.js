import { useState, useCallback } from "react";
import { searchBooks } from "@/services/searchService";

export const useSearchBooks = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = useCallback(async (formInfo) => {
        if (!formInfo.title && !formInfo.author && !formInfo.category && !formInfo.price) {
            setError("Vui lòng điền ít nhất một thông tin sách");
            setBooks([]);
            return;
        }
        try {
            setIsLoading(true);
            setError('');

            const query = Object.keys(formInfo).reduce((acc, key) => {
                if (formInfo[key]) {
                    acc[key] = formInfo[key];
                }
                return acc;
            }, {});

            const resp = await searchBooks(query);
            setBooks(resp.data);
            setError('');

        } catch (error) {
            setBooks([]);
            if (error.status === 404) {
                setError(error.response.data.message);
            } else {
                console.error(error);
                setError('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { books, error, isLoading, handleSearch };
}
