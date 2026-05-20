import { apiCreateTask } from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => apiCreateTask(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            console.log(`tao thanh cong id moi la: ${data._id}`);

        },
        onError: (error) => {
            console.error("loi: ", error.message);
        },
        onSettled: () => {
            console.log("Mutation hoan tat");

        }
    })
}