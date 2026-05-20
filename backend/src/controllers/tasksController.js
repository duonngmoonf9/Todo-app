import Task from "../models/Task.js";


//controller get task
const getAllTasks = async (request, response) => {
    const { filter = 'today' } = request.query;
    const now = new Date();
    let startDate;

    switch (filter) {
        case "today": {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-08-24 00:00
            break;
        }
        case "week": {
            const mondayDate =
                now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        }
        case "month": {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        case "all":
        default: {
            startDate = null;
        }
    }

    const query = startDate ? { createdAt: { $gte: startDate } } : {};
    try {
        // const tasks = await Task.find().sort({ createdAt: -1 }); // lấy ra dữ liệu bảng task
        const result = await Task.aggregate([
            { $match: query },
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
                    completeCount: [{ $match: { status: "complete" } }, { $count: "count" }],
                }
            }
        ])

        const data = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        response.status(200).json({
            data,
            activeCount,
            completeCount,
            status: true,
            code: 200,
            message: "get all tasks thanh cong"
        });
    } catch (error) {
        console.log(`loi goi getAllTasks:, ${error}`);
        response.status(500).json({ status: false, message: error.message });
    }
}





// Thêm hàm get data task theo pagination
const getTasksPaginated = async (request, response) => {
    // Nhận các tham số từ Frontend gửi lên, gán giá trị mặc định nếu không có
    const { dateFilter = 'today', statusFilter = 'all', page = 1, limit = 5 } = request.query;
    const skip = (Number(page) - 1) * Number(limit);

    const now = new Date();
    let startDate;

    switch (dateFilter) {
        case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case "week":
            const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case "all":
        default:
            startDate = null;
    }

    const dateQuery = startDate ? { createdAt: { $gte: startDate } } : {};

    // Điều kiện lọc riêng cho danh sách hiển thị
    let listMatch = { ...dateQuery };
    if (statusFilter === 'active') listMatch.status = 'active';
    if (statusFilter === 'complete') listMatch.status = 'complete';

    try {
        const result = await Task.aggregate([
            {
                $facet: {
                    // 1. Lấy data danh sách (có tính trang và trạng thái)
                    tasks: [
                        { $match: listMatch },
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: Number(limit) }
                    ],
                    // 2. Tính tổng số trang dựa trên bộ lọc
                    totalFiltered: [
                        { $match: listMatch },
                        { $count: "count" }
                    ],
                    // 3. Tính đếm số lượng chung cho Header (chỉ dựa theo ngày)
                    activeCount: [
                        { $match: { ...dateQuery, status: "active" } },
                        { $count: "count" }
                    ],
                    completeCount: [
                        { $match: { ...dateQuery, status: "complete" } },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        const data = result[0].tasks;
        const totalItems = result[0].totalFiltered[0]?.count || 0;
        const totalPages = Math.ceil(totalItems / Number(limit));

        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;

        response.status(200).json({
            data,
            totalPages,
            hasNextPage: Number(page) < totalPages, // Trả về flag để prefetch
            activeCount,
            completeCount,
            status: true,
            code: 200,
            message: "get paginated tasks thanh cong"
        });
    } catch (error) {
        console.log(`loi goi getTasksPaginated:, ${error}`);
        response.status(500).json({ status: false, message: error.message });
    }
}


//controller create task
const createTask = async (request, response) => {
    try {
        const { name } = request.body; // lấy dữ liệu từ client gửi lên
        const task = new Task({
            name
        }) // gui du lieu can luu vao bang

        const newTask = await task.save(); // luu du lieu vao bang
        response.status(201).json({
            newTask,
            message: "create task thanh cong",
            status: true,
            code: 200,
        });
    } catch (error) {
        console.log(`loi goi createTask:, ${error}`);
        response.status(500).json({ message: error.message });
    }
}


//controller update task
const updateTask = async (request, response) => {
    try {
        const { name, status, completedAt } = request.body;
        const updatedTask = await Task.findByIdAndUpdate(
            request.params.id, {
            name,
            status,
            completedAt
        },
            { new: true }
        );
        if (!updatedTask) {
            return response.status(404).json({ message: "Nhiem vu khong ton tai" })
        }
        response.status(200).json({
            updatedTask,
            message: "update task thanh cong",
            status: true,
            code: 200,
        });


    } catch (error) {
        console.log(`loi goi updateTask:, ${error}`);
        response.status(500).json({ message: error.message });
    }
}


//controller delete task
const deleteTask = async (request, response) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(request.params.id);
        if (!deletedTask) {
            return response.status(404).json({ message: "Nhiem vu khong ton tai" })
        }
        response.status(200).json({
            deletedTask,
            message: "delete task thanh cong",
            status: true,
            code: 200,
        });
    } catch (error) {
        console.log(`loi goi deleteTask:, ${error}`);
        response.status(500).json({ message: error.message });
    }
}

export { createTask, deleteTask, getAllTasks, getTasksPaginated, updateTask };

