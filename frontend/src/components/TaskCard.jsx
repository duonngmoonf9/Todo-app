import { cn } from "@/lib/utils";
import { apiDeleteOutcome, apiUpdateTask } from "@/services/api.service";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

const TaskCard = ({ task, index, handleTaskChange }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [taskUpdate, setTaskUpdate] = useState(task.name || "");

    const fetchUpdateTask = async () => {
        setIsEditing(false);

        const res = await apiUpdateTask({ name: taskUpdate }, task._id);
        if (res.status) {
            toast.success(res.message);
            handleTaskChange();
        } else {
            toast.error(res.message);
        }
    }

    const fetchDeleteTask = async (id) => {
        if (confirm("ban muon xóa nhiệm vụ này")) {
            const res = await apiDeleteOutcome(id);
            if (res.status) {
                toast.success(res.message)
                handleTaskChange();
            } else {
                toast.error(res.message);
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchUpdateTask()
        }
    }

    const toggleTaskCompleteChange = async () => {
        if (task.status === "active") {
            const res = await apiUpdateTask({ status: "complete", completedAt: new Date().toISOString() }, task._id);
            if (res.status) {
                toast.success(`${task.name} đã hoàn thành.`);
                handleTaskChange();
            } else {
                toast.error(res.message);
            }
        } else {
            const res = await apiUpdateTask({ status: "active", completedAt: null }, task._id);
            if (res.status) {
                toast.success(`${task.name}đã đổi sang chưa hoàn thành.`);
                handleTaskChange();
            } else {
                toast.error(res.message);
            }
        }
    }

    return (
        <Card className={cn(
            "p-4 bg-gradient-card border-0 shadow-custom hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
            task.status === 'complete' && 'opacity-75'
        )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center gap-4">
                {/* nut check */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("flex-shrink-0 size-8 rounded-full transition-all duration-200",
                        task.status === 'complete' ? 'text-success hover:text-success/80' :
                            'text-muted-foreground hover:text-primary'
                    )}
                    onClick={toggleTaskCompleteChange}
                >
                    {task.status === 'complete' ?

                        <CheckCircle2 className="size-5"></CheckCircle2> :
                        <Circle className="size-5"></Circle>}
                </Button>

                {/* hien thi chinh sua tieu de */}
                <div className="flex-1 min-w-0">
                    {isEditing ?
                        <Input
                            placeholder="can lam gi"
                            className={"flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"}
                            type='text'
                            value={taskUpdate}
                            onChange={(e) => setTaskUpdate(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                if (taskUpdate.trim() !== "" && taskUpdate !== task.name) {
                                    fetchUpdateTask(); // Thực hiện lưu
                                } else {
                                    // Nếu không đổi gì (hoặc lỡ xoá trắng) thì huỷ edit và trả lại tên cũ
                                    setIsEditing(false);
                                    setTaskUpdate(task.name || "");
                                }
                            }}
                        /> :
                        <p className={cn("text-base transition-all duration-200",
                            task.status === 'complete' ? 'line-through text-muted-foreground' : 'text-foreground'
                        )}>
                            {task.name}
                        </p>
                    }
                    {/* ngày tạo & ngày hoàn thành */}
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            {new Date(task.createdAt).toLocaleString()}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className="text-xs text-muted-foreground"> - </span>
                                <Calendar className="size-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                    {new Date(task.completedAt).toLocaleString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                {/* nút chỉnh và xoá */}
                <div className="inline-flex gap-2 md:hidden md:group-hover:inline-flex animate-slide-up">
                    {/* nút edit */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info cursor-pointer"
                        onClick={() => {
                            setIsEditing(true);
                            setTaskUpdate(task.name || "");
                        }}
                    >
                        <SquarePen className="size-4" />
                    </Button>

                    {/* nút xoá */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() => fetchDeleteTask(task._id)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>
        </Card >
    )
}

export default TaskCard