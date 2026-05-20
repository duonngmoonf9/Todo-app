import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { options } from "@/lib/data";

export function DateTimeFilter({ dateQuery, setDateQuery }) {
    // Tìm object (option) có value khớp với chuỗi dateQuery hiện tại
    const selectedOption = options.find((opt) => opt.value === dateQuery) || null;

    return (
        <Combobox
            items={options}
            itemToStringValue={(option) => (option ? option.label : "")}
            // Truyền giá trị đã được chọn vào Combobox
            value={selectedOption}
            // Xử lý sự kiện khi người dùng chọn một mục khác
            onValueChange={(option) => {
                if (option) {
                    setDateQuery(option.value);
                }
            }}
        >
            <ComboboxInput placeholder="Chọn thời gian" />
            <ComboboxContent>
                <ComboboxEmpty>Không tìm thấy.</ComboboxEmpty>
                <ComboboxList>
                    {(option) => (
                        <ComboboxItem key={option.value} value={option}>
                            {option.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}