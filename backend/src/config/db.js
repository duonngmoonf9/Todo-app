import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // CHÚ Ý: Đây chỉ là ví dụ định dạng. 
        // Bạn BẮT BUỘC phải copy chuỗi thực tế từ bước 1, sau đó thay mật khẩu và tên database ("test") vào.
        const uri = process.env.MONGDB_CONNECTIONSTRING;

        await mongoose.connect(uri);
        console.log("Ket noi data thanh cong");
    } catch (error) {
        console.error("loi ket noi data:", error.message);
        process.exit(1);
    }
}

export { connectDB };

// hmsiB68OnYuTleY3