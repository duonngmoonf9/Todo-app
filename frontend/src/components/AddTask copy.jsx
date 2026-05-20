import { apiCreateTask } from "@/services/api.service"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"

const AddTask = ({ handleNewTaskAdd }) => {
    const [newTask, setNewTask] = useState('');

    const fetchAddTask = async () => {
        if (newTask.trim()) {
            const res = await apiCreateTask({ name: newTask });
            if (res.status) {
                toast.success(res.message);
                // render component cha
                handleNewTaskAdd();
            } else {
                toast.error(res.message);
            }
            setNewTask("");
        } else {
            toast.error("can nhap noi dung")
        }

    }

    const handleKeyPress = (e) => {
        if (e.key === 'enter') {
            fetchAddTask()
        }
    }

    return (
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="flex flex-col gap-3 sm:flex-col">
                <Input
                    type="text"
                    placeholder="Cần phải làm gì?"
                    className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button
                    variant="gradient"
                    size="xl"
                    className={"px-6"}
                    onClick={fetchAddTask}
                    disabled={!newTask.trim()}

                >
                    <Plus className="size-5" />Thêm</Button>
            </div>

        </Card>
    )
}

export default AddTask