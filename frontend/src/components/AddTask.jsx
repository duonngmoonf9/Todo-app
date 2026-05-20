import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
// Import custom hook của bạn (nhớ kiểm tra lại đường dẫn cho đúng nhé)
import { useCreateTask } from "@/hook/use-create-task"

const AddTask = () => {
    const [newTask, setNewTask] = useState('');

    // Gọi custom hook
    const { mutate: createTask, isPending } = useCreateTask();

    const fetchAddTask = async () => {
        if (newTask.trim()) {
            // Gọi hàm mutate, truyền data vào tham số đầu tiên
            createTask(
                { name: newTask },
                {
                    // Tham số thứ 2 là các callback chạy sau khi API trả về
                    onSuccess: (res) => {
                        if (res.status) {
                            toast.success(res.message);
                            setNewTask(""); // Xóa trắng input khi thành công
                        } else {
                            toast.error(res.message);
                        }
                    },
                    onError: () => {
                        toast.error("Có lỗi xảy ra, không thể thêm nhiệm vụ");
                    }
                }
            );
        } else {
            toast.error("Cần nhập nội dung")
        }

    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchAddTask()
        }
    }

    return (
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="flex flex-col gap-3 sm:flex-row">

                <Input
                    type="text"
                    placeholder="Cần phải làm gì?"
                    className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isPending}
                />
                <Button
                    variant="gradient"
                    size="xl"
                    className={"px-6"}
                    onClick={fetchAddTask}
                    disabled={!newTask.trim() || isPending}

                >
                    <Plus className="size-5" />Thêm</Button>
                {isPending ? "Đang thêm..." : "Thêm"}
            </div>

        </Card>
    )
}

export default AddTask