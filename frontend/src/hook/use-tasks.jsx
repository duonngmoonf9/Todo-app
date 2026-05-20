import { apiGetTask } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export const useTasks = (dateQuery) => {
    return useQuery({
        queryKey: ["tasks", "list", dateQuery],
        queryFn: () => apiGetTask(dateQuery),
        staleTime: 5 * 1000
    });
}