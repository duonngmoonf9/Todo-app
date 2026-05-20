import { apiGetTaskPagination } from "@/services/api.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useTaskPagination = ({ page, filter, dateQuery, limit }) => {
    return useQuery({
        // Bắt buộc phải có đủ tham số trong queryKey
        queryKey: ["tasks", "pagination", dateQuery, filter, page],

        queryFn: () => apiGetTaskPagination({ page, limit, statusFilter: filter, dateFilter: dateQuery }),
        placeholderData: keepPreviousData,
        staleTime: 5 * 1000,
    })
}