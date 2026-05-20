import AddTask from "@/components/AddTask"
import { DateTimeFilter } from "@/components/DateTimeFilter"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import StartsAndFilters from "@/components/StartsAndFilters"
import TaskList from "@/components/TaskList"
import TaskListPagination from "@/components/TaskListPagination-vbeta"
import { useTaskPagination } from "@/hook/use-task-pagination"
import { visibleTaskLimit } from "@/lib/data"
import { apiGetTaskPagination } from "@/services/api.service"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const HomePages = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('all');
    const [dateQuery, setDateQuery] = useState('today');
    const [page, setPage] = useState(1);

    // 1. Fetch dữ liệu từ Backend
    const { data: res, isPending, isError, error, refetch } = useTaskPagination({
        page,
        filter,
        dateQuery,
        limit: visibleTaskLimit
    });

    const tasks = res?.status ? res.data : [];
    const totalPages = res?.totalPages || 0;
    const hasNextPage = res?.hasNextPage ?? false;
    const activeCount = res?.activeCount || 0;
    const completeCount = res?.completeCount || 0;

    // 2. Logic Tự lùi về trang 1 khi đổi bộ lọc
    useEffect(() => {
        setPage(1);
    }, [filter, dateQuery]);

    // 3. Logic Prefetch tải trước dữ liệu trang tiếp theo
    useEffect(() => {
        if (!hasNextPage) return;
        queryClient.prefetchQuery({
            queryKey: ["tasks", "pagination", dateQuery, filter, page + 1],
            queryFn: () => apiGetTaskPagination({
                page: page + 1,
                limit: visibleTaskLimit,
                filter: filter,
                dateQuery: dateQuery
            }),
            staleTime: 5 * 1000,
        });
    }, [page, filter, dateQuery, hasNextPage, queryClient]);

    // 4. Các hàm xử lý
    const handleTaskChange = () => refetch();

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    }

    const handleBack = () => {
        if (page > 1) setPage(prev => prev - 1);
    }

    const handleRandom = (newPage) => setPage(newPage);

    // Logic tự động lùi trang nếu trang hiện tại bị trống (do xóa hết item)
    useEffect(() => {
        // Chỉ chạy check khi API đã load xong (!isPending)
        // Nếu danh sách task rỗng và đang ở trang lớn hơn 1 -> Lùi 1 trang
        if (!isPending && tasks.length === 0 && page > 1) {
            setPage(prev => prev - 1);
        }
    }, [tasks.length, page, isPending]);

    // 5. Early Returns
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
                            filteredTasks={tasks}
                            filter={filter}
                            handleTaskChange={handleTaskChange}
                        />

                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <TaskListPagination
                                handleNext={handleNext}
                                handleBack={handleBack}
                                handleRandom={handleRandom}
                                page={page}
                                totalPages={totalPages}
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