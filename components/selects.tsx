import { SelectContent, SelectGroup, SelectItem } from "./ui/select";
import dataKampus from "@/server/data/bartin-university-jurusan.json";

export const SelectFakultas = () => {
  return (
    <SelectContent>
      <SelectGroup>
        {dataKampus.map((item) => (
          <SelectItem key={item.fakultas} value={item.fakultas || ""}>
            {item.fakultas}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectJurusan = ({ fakultas }: { fakultas: string }) => {
  const items =
    dataKampus.find((data) => data.fakultas === fakultas)?.jurusan ?? [];

  return (
    <SelectContent>
      <SelectGroup>
        {items.map((item) => (
          <SelectItem key={item} value={item || ""}>
            {item}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectStatusPelajar = () => {
  const items = [{ value: "TÖMER" }, { value: "ÜNİVERSİTE" }];
  return (
    <SelectContent>
      <SelectGroup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value || ""}>
            {item.value}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};

export const SelectAngkatan = () => {
  const items = [
    { value: "2020" },
    { value: "2021" },
    { value: "2022" },
    { value: "2023" },
    { value: "2024" },
    { value: "2025" },
  ];

  return (
    <SelectContent>
      <SelectGroup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value || ""}>
            {item.value}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  );
};
