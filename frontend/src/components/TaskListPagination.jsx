import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { visibleTaskLimit } from "@/lib/data";
import { cn } from "@/lib/utils";

const TaskListPagination = ({
    handleNext,
    handleBack,
    handleRandom,
    page,
    totalPages,
    filterBuffer
}) => {
    const generatePages = () => {
        const pages = [];

        if (totalPages < 4) {
            // hiện toàn bộ
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (filterBuffer.length === visibleTaskLimit) {
                pages.push(1);
            }
            else if (page <= 2) {
                pages.push(1, 2, "...", totalPages);
            } else if (page >= totalPages - 1) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", page, "...", totalPages);
            }
        }

        return pages;
    };

    // Tính toán trạng thái disable
    const isPrevDisabled = Number(page) <= 1;
    const isNextDisabled = Number(page) >= Number(totalPages) || Number(totalPages) === 0;

    const pagesToShow = generatePages();

    return (
        <div className="flex justify-center mt-4">
            <Pagination>
                <PaginationContent>
                    {/* Trước */}
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={isPrevDisabled ? undefined : handleBack}
                            className={cn(
                                "cursor-pointer",
                                isPrevDisabled && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>

                    {pagesToShow.map((p, index) => (
                        <PaginationItem key={index}>
                            {p === "..." ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    isActive={p === page}
                                    onClick={() => {
                                        if (p !== page) handleRandom(p);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {p}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Sau */}
                    <PaginationItem>
                        <PaginationNext
                            onClick={isNextDisabled ? undefined : handleNext}
                            className={cn(
                                "cursor-pointer",
                                isNextDisabled && "pointer-events-none opacity-50"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default TaskListPagination;