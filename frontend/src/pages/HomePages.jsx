import AddTask from "@/components/AddTask"
import { DateTimeFilter } from "@/components/DateTimeFilter"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import StartsAndFilters from "@/components/StartsAndFilters"
import TaskList from "@/components/TaskList"
import TaskListPagination from "@/components/TaskListPagination"
import { useTasks } from "@/hook/use-tasks"
import { visibleTaskLimit } from "@/lib/data"
import { useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from "sonner"

const HomePages = () => {
    const [filter, setFilter] = useState('all');
    const [dateQuery, setDateQuery] = useState('today');
    const [page, setPage] = useState(1);


    const { data: res, isPending, isError, error, refetch } = useTasks(dateQuery);


    // Bóc tách dữ liệu từ API thay vì dùng useState
    const tasksBuffer = res?.status ? res.data : [];
    const activeCount = res?.status ? res.activeCount : 0;
    const completeCount = res?.status ? res.completeCount : 0;


    // Đưa logic tự lùi trang vào useEffect để tránh lỗi update state khi đang render
    useEffect(() => {
        if (res && !res.status) {
            toast.error(res.message);
        }
    }, [res]);


    useEffect(() => {
        setPage(1);
    }, [filter, dateQuery]);


    // bien
    const filterBuffer = tasksBuffer.filter(task => {
        switch (filter) {
            case "active":
                return task.status === "active";
            case "complete":
                return task.status === "complete"
            default:
                return true
        }
    })


    // Hàm gọi lại task khi thêm mới hoặc update (Dùng refetch của React Query)
    const handleTaskChange = () => {
        refetch();
    };


    //tinh toan so nhiem vu hien thi tren trang [0,1,2,3,4].slice(0,2) => [0,1]
    const visibleTasks = filterBuffer.slice(
        (page - 1) * visibleTaskLimit,
        page * visibleTaskLimit
    )

    const totalPages = Math.ceil(filterBuffer.length / visibleTaskLimit); //tong so nhiem vu chia cho limit thi lay duoc tong so trang

    // ham next trang
    const handleNext = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    }

    //ham back trang
    const handleBack = () => {
        if (page > 1) {
            setPage(prev => prev - 1)
        }
    }
    //trang bat ky
    const handleRandom = (newPage) => {
        setPage(newPage)
    }

    if (visibleTasks.length == 0) {
        handleBack();
    }


    if (isPending) return <Skeleton />
    if (isError) return <p className="state-error">Lỗi: {error.message}</p>

    return (

        <>
            <div className="min-h-screen w-full bg-white relative">
                {/* Teal Glow Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
                            radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)
                        `,
                        backgroundSize: "100% 100%",
                    }}
                />
                <div className="container pt-8 mx-auto relative z-10">
                    <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                        {/* dau trang */}
                        <Header />

                        {/* tao nhiem vu */}
                        <AddTask />

                        {/* thong ke va bo loc */}
                        <StartsAndFilters
                            completedTasksCount={completeCount}
                            activeTasksCount={activeCount}
                            filter={filter}
                            setFilter={setFilter}
                        />

                        {/* Danh sach nhiem vu */}
                        <TaskList
                            filteredTasks={visibleTasks}
                            filter={filter}
                            handleTaskChange={handleTaskChange}
                        />

                        {/* phan trang va loc theo ngay */}
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <TaskListPagination
                                handleNext={handleNext}
                                handleBack={handleBack}
                                handleRandom={handleRandom}
                                page={page}
                                totalPages={totalPages}
                                filterBuffer={filterBuffer}
                            />
                            <DateTimeFilter
                                dateQuery={dateQuery}
                                setDateQuery={setDateQuery}
                            />
                        </div>

                        {/* chan trang */}
                        <Footer
                            completedTasksCount={completeCount}
                            activeTasksCount={activeCount}
                        />
                    </div>

                </div>
            </div>

        </>
    )
}

export default HomePages